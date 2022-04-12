const Item = require('../model/items.model');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
var fs = require('fs');

exports.getItems = (req, res) => {
    Item.find({ status: true })
        .then(items => {
            res.send(items)
        })
        .catch(err => {
            res.status(500).send("Something went wrong! Try again.")
        })
}

exports.getItemById = async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
    {
        return res.status(404).send("Item not found");
    }

    try{
        const item = await Item.findById(req.params.id).exec();
        if(!item){
            return res.status(404).send("Item not found");
        }
        res.send(item)
    }
    catch(err) {
        res.status(500).send("Something went wrong! Try again.")
    }

}

const processImages = async (request, response, item) => {
    if (request.files) {
        let image = request.files.image;
        if(!image.length)
        {
            image = [image];
        }
        var imageArray = item.image ? item.image : [];

        for(let img of image)
        {
            const imageName = Date.now() + '-' + img.name;
            let dir = './public/items/' + item._id + '/';
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            try{
                await img.mv(dir + imageName)
                imageArray = [ ...imageArray, imageName]
            }
            catch(err)
            {
                return response.status(500).send("Something went wrong! Try again.")
            }
        }
        item.image = imageArray;
        item.save()
        .then(item => {  
            response.send(item);
        })
        .catch(err => {
            return response.status(500).send("Something went wrong! Try again.")
        })
    }
    else{
        item.images = [];
        item.save()
        .then(item => {  
            response.send(item);
        })
        .catch(err => {
            return response.status(500).send("Something went wrong! Try again.")
        })
    }
}

exports.createItem = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let itemBody = req.body
    itemBody.price = Number(itemBody.price).toFixed(2);
    let item = new Item(req.body);
    processImages(req, res, item);
}

exports.updateItem = (req, res) => {
    const updatedItem = req.body;
    console.log(updatedItem)
    Item.updateOne({_id: req.params.id} , {$set: { ...updatedItem }})
    .then(item => {
        console.log(item)
        if(!item.acknowledged)
        {
            return res.status(500).send("Something went wrong! Try again.");
        }
        res.send(item);
    })
    .catch(err => {
        res.status(500).send("Something went wrong! Try again.");
    });
    
}

exports.uploadImage = async (req, res) => {
    console.log(req.body)
    console.log(req.files)
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
    {
        return res.status(404).send("Item not found");
    }

    try{
        const item = await Item.findById(req.params.id).exec();
        if(!item){
            return res.status(404).send("Item not found");
        }
        processImages(req, res, item);
    }
    catch(err) {
        res.status(500).send("Something went wrong! Try again.")
    }
}

exports.deleteItem = (req, res) => {

    Item.findByIdAndDelete(req.params.id)
        .then(item => {
            if(!item)
            {
                return res.status(404).send("Item doesn't exist")
            }
            res.send(item);
        })
        .catch(err => {
            res.status(500).send("Something went wrong! Try again.")
        })
}