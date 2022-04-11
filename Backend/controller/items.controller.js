const Item = require('../model/items.model');
const { validationResult } = require('express-validator');
var fs = require('fs');

exports.getItems = (req, res) => {
    Item.find()
        .then(items => {
            res.send(items)
        })
        .catch(err => {
            res.sendStatus(500)
        })
}

exports.getItemById = async (req, res) => {
    try{
        const item = await Item.findById(req.params.id)
        if(!item){
            return res.status(404).json({"error":"Item not found"});
        }
        res.send(item)
    }
    catch(err) {
        res.sendStatus(500)
    }

}

const processImages = async (req, res, item) => {
    if (req.files) {
        let image = req.files.image;
        if(!image.length)
        {
            image = [image]
        }
        var imageArray = []

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
                return res.sendStatus(500)
            }
        }
        item.image = imageArray;
        item.save()
        .then(item => {  
            res.send(item);
        })
        .catch(err => {
            return res.status(500);
        })
    }
    else{
        item.images = null;
        item.save();
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

    Item.findByIdAndUpdate(req.params.id, req.body)
    .then(item => {
        if(!item)
        {
            return res.json({"error":"Item doesn't exist."})
        }
        res.send(item);
    })
    .catch(err => {
        res.json({'error': err});
    });
    
}


exports.deleteItem = (req, res) => {

    Item.findByIdAndDelete(req.params.id)
        .then(item => {
            if(!item)
            {
                return res.json({"error":"Item doesn't exist."})
            }
            res.send(item);
        })
        .catch(err => {
            res.json({'error': err});
        })
}