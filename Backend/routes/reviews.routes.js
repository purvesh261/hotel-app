const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../controller/authorization');
const controller = require('../controller/reviews.controller');

router.get("/item/:id", authenticateToken, controller.getReviewsByItemId);
router.get("/item/:id/reviews", authenticateToken, controller.getWrittenReviewsByItemId);
router.get("/item/:itemId/:userId", authenticateToken, controller.getItemReviewByUser);
router.post("/", authenticateToken, controller.createReview);
module.exports = router;