import {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
} from "./handleFactory.js";
import Review from "../models/reviewModel.js";

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review);
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
