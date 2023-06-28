import {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
} from "./handleFactory.js";
import Tour from "../models/tourModel.js";

export const getAllTours = getAll(Tour);
export const getTour = getOne(Tour);
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);
