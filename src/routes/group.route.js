import express from "express";
import { createGroup, getAllGroups } from "../controllers/group.controller.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
const groupRoute = express.Router();
groupRoute.post("/createGroup", authenticatedUser, createGroup);
groupRoute.get("/getAllGroups", authenticatedUser, getAllGroups);
export default groupRoute;
