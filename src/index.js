// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
// import express from "express";
import { app } from "./app.js";
// const app = express();

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.get("/mongo", (req, res) => {
      res.send("Mongo DB Connection Connect Successfully!");
    });
  })
  .catch((error) => {
    console.log("Rendering Error : ", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`server is listen on http://localhost:${process.env.PORT}`);
});
