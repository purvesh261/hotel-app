const Item = require('../model/items.model');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
var fs = require('fs');
const error500msg = "Something went wrong! Try again.";
const error404msg = "Item not found";

exports.getItems = (req, res) => {
    Item.find({ status: true })
        .then(items => {
            res.send(items)
        })
        .catch(err => {
            res.status(500).send(error500msg)
        })
}

exports.getItemById = async (req, res) => {
    // check if id is a valid mongo id
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
    {
        return res.status(404).send(error404msg);
    }

    try{
        const item = await Item.findById(req.params.id).exec();
        if(!item){
            return res.status(404).send(error404msg);
        }
        res.send(item)
    }
    catch(err) {
        res.status(500).send(error500msg)
    }
}

const saveImages = async (request, response, item) => {
    if (request.files) {
        let images = request.files.image;
        if(!images.length)
        {
            images = [images];
        }
        var imageArray = item.image ? item.image : [];

        for(let img of images)
        {
            // saves the uploaded images in a directory identified by the item's id
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
                return response.status(500).send(error500msg)
            }
        }
        item.image = imageArray;
        item.save()
            .then(item => {  
                response.send(item);
            })
            .catch(err => {
                return response.status(500).send(error500msg);
            })
    }
    else{
        item.images = [];
        item.save()
            .then(item => {  
                response.send(item);
            })
            .catch(err => {
                return response.status(500).send(error500msg);
            })
    }
}

exports.createItem = (req, res) => {
    // return validation errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let itemBody = req.body
    itemBody.price = Number(itemBody.price).toFixed(2);
    let item = new Item(req.body);
    saveImages(req, res, item);
}

exports.updateItem = (req, res) => {
    const updatedItem = req.body;
    
    Item.updateOne({_id: req.params.id} , {$set: { ...updatedItem }})
        .then(result => {
            if(!result.acknowledged)
            {
                return res.status(500).send(error500msg);
            }
            res.send(result);
        })
        .catch(err => {
            res.status(500).send(error500msg);
        });
    
}

exports.uploadImage = async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
    {
        return res.status(404).send(error404msg);
    }

    try{
        const item = await Item.findById(req.params.id).exec();
        if(!item){
            return res.status(404).send(error404msg);
        }
        saveImages(req, res, item);
    }
    catch(err) {
        res.status(500).send(error500msg)
    }
}

exports.deleteItem = (req, res) => {

    Item.findByIdAndDelete(req.params.id)
        .then(item => {
            if(!item)
            {
                return res.status(404).send(error404msg);
            }
            res.send(item);
        })
        .catch(err => {
            res.status(500).send(error500msg);
        })
}