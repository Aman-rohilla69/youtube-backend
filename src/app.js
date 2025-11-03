import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// cors ka use kyu krte hai?
// jab humara frontend alag server pr host hota hai
// aur backend alag server pr hota hai

app.use(
  cors({
    // origin ka mtlb hai ki kaunse domains se requests allow karni hai

    origin: process.env.CORS_ORIGIN,
    credentials: true,
    // credentials ka mtlb hai ki cookies ko allow krna
    // agar hum credentials ko true krte hai to cookies allow hongi
  }),
);

// middlewares ka use kyu krte hai?
// request ko process krne ke liye..
// cookies ko read krne ke liye
// content-type ko json me convert krne ke liye

app.use(express.json({ limit: "20kb" }));
// ye middleware request body ko json me convert krta hai
// aur limit set krta hai ki maximum kitna data hum accept krte hai

// express.urlencoded() middleware ko use krne se hum url-encoded data ko parse kr sakte hai
// jo form submissions me aata hai
// parse ka mtlb data ko read krna aur use karna hota hai
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
// extended:true ka mtlb hai ki hum nested objects ko bhi parse kr sakte hai mtlab agar form me koi object hai to use bhi parse kr lega
// static ka use kya hai?
// static files jaise images, css, js files ko serve krne ke liye
// public folder ko static folder bana diya hai
app.use(express.static("public"));
// cookie-parser kya hota hai?
// ye ek middleware hai jo cookies ko parse krta hai
// aur unhe req.cookies object me store krta hai
app.use(cookieParser());
app.get("/",(req,res)=>{
  res.send ("Server is running")
})

// routes :-

import userRouter from "./routes/user.routes.js";

// routes declaration :-
// router ko laane ke liye aap.use() yani middleware ke roop me use karte hai
app.use("/api/v1/users", userRouter); // prefix /users ka mtlb hai ki ye saare routes /users se start honge logic ye hai ki humare sare user related routes yha honge
// ab jab bhi koi request /api/v1/users pr aayegi to wo userRouter me jayegi
// http:localhost:8000/api/v1/users/register  // pe aayega
export { app };
