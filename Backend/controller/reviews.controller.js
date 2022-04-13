const Review = require('../model/reviews.model');
const Item = require('../model/items.model');
const mongoose = require('mongoose');
const error500msg = "Something went wrong! Try again.";

exports.getReviewsByItemId = async (req, res) => {
    try{
        var reviews = await Review
                            .find({item: req.params.id})
                            .populate("user", "username")
        res.send(reviews);
    }
    catch(err) {
        res.status(500).send(error500msg);
    }
}

exports.getItemReviewByUser = async (req, res) => {
    try{
        var review = await Review
                            .findOne({item: req.params.itemId, user: req.params.userId})
        res.send(review);
    }
    catch(err) {
        res.status(500).send(error500msg);
    }
}

exports.getWrittenReviewsByItemId = async (req, res) => {
    try{
        var reviews = await Review
                            .find({item: req.params.id, review: {"$ne": ""}})
                            .populate("user", "username")
        res.send(reviews);
    }
    catch(err){

    }
}
exports.createReview = async (req, res) => {
    try{
        var newReview = await Review.create(req.body);
        newReview.save()
        var item = await Item.findOne({_id:newReview.item});
        item.totalRatings = item.totalRatings + 1;
        item.averageRating = ((Number(item.averageRating) * item.totalRatings) + Number(newReview.rating)) / (item.totalRatings);
        item.averageRating = Number(item.averageRating).toFixed(2);
        item.save();
        res.send(newReview);
    }
    catch(err) {
        console.log(err)
        res.status(500).send(error500msg);
    }
}