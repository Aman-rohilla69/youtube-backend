import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      // cookies mai se token lelo ya fir authorization se lelo..
      // req ke pass cookies ka access aaya kaise aap.ccokieparser() se.
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // ye jab agar koi mobile app pe h.. jb koi mobile se custrom header bhej raha ho.

    if (!token) {
      throw new ApiError(401, "Unauthorized request ");
    }
    // token ko decode krlo..
    // .verify (2) doh cheez leta h.. string tokens aur tokens ki secret key.
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // user ko find krlo..
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      //  next_vdo : discuss about frontend
      throw new ApiError(401, "Invalid Access Token ");
    }
    // user ki informaition add krva rhe h.. user mai.
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401,"Invalid access token");
  }
});
