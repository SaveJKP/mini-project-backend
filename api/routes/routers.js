import express from "express";
import noteRouter from "./noteRouters.js";
import userRouter from "./userRouters.js";
const router = express.Router();

export const routers = () => {
  router.use("/user", userRouter);
  router.use("/note", noteRouter);
  return router;
};
