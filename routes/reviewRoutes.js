import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} from "../controller/reviewController.js";

const router = express.Router();

router.route("/").get(getAllReviews).post(createReview);
router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);

export default router;
