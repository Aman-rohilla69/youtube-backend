import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// router.route() ka mtlb hai ki hum ek specific route pr different HTTP methods ko handle kr sakte hai
// jaise ki GET, POST, PUT, DELETE etc.
// .post() ka mtlb hai ki jab koi POST request aayegi to usse handle krne ke liye ye function chalega
router.route("/register").post(
  // upload ek middleware h.. jo register krne se phele file ko check kr raha h..
  // avatar or coverImage ko..
  // .fields() array leta h.. issme hum 1 se jayada file uploads kra sakte h..
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(loginUser);

// secured routes:-
// verifyJWT ek middleware h..
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router; // yahi h.. userRouter export krna hai
