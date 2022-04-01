const Item = require('../model/items.model');
const { validationResult } = require('express-validator')

exports.getItems = (req, res) => {
    Item.find()
        .then(items => {
            res.send(items)
        })
        .catch(err => {
            res.json({'error': err})
        })
}

exports.createItem = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newItem = req.body;

    Item.create(newItem)
        .then(item => {
            res.send(item);
        })
        .catch(err => {
            res.json({'error': err});
        })

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