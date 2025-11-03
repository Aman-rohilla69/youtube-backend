// registerUser Steps :-
// get users details from frontend
// validation :- not empty , check krna ki sb thik h.. ya nhi
// check if user alreday exists : username, email se
// check for images, check for avatar
// agar ye images available h.. toh cloudinary pr bhej doh, fir isme check kro ki avatar h.. ya nhi
// create user object  :- create entry in db
// remove password and refresh token from response / to user
// check kro ki user create hua ki nhi /response aaya ki nhi
// agar hoo gya to response bhej do frontend ko ki user create ho gya
//  agar nhi hua to error bhej do
// import User from "./src/models/user.model.js";
// import { ApiError } from "./src/utils/ApiError";
// import { ApiResponse } from "./src/utils/ApiResponse";
// import { asyncHandler } from "./src/utils/asyncHandler.js";
// import { uploadOnCloudinary } from "./src/utils/cloudinary";

// const registerUser = asyncHandler(async (req, res) => {
//   //get users details from frontend
//   const { username, fullName, email, password } = req.body;
//   console.log("Email : ", email);
//   // validation :- not empty , check krna ki sb thik h.. ya nhi
//   if (
//     [username, fullName, email, password].some((fields) => {
//       fields?.trim() === "";
//     })
//   ) {
//     throw new ApiError(400, "Fields are empty ! please Check ");
//   }
//   // check if user alreday exists : username, email se
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });
//   if (!existedUser) {
//     throw new ApiError(409, "existedUser not found!");
//   }
//   // check for images, check for avatar
//   const avatarLocalPath = await req.fiels?.avatar[0]?.path;
//   const coverImageLocalPath = await req.fiels?.coverImage[0]?.path;

//   // check kr rhe h.. ki avatar file h.. ya nhi
//   // coverImage optional h.. toh uske liye check nhi krna h..

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "avatar file is not available");
//   }
//   // agar ye images available h.. toh cloudinary pr bhej doh, fir isme check kro ki avatar h.. ya nhi

//   const avatar = uploadOnCloudinary(avatarLocalPath);
//   const coverImage = uploadOnCloudinary(coverImageLocalPath);

//   if (!avatar) {
//     throw new ApiError(400, "avatar file is required");
//   }

//   // create user object  :- create entry in db

//   const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     password,
//     email,
//     username: username.toLowerCase(),
//   });

//   const createdUser = await User.findById(user._Id).select(
//     "-password -refreshToken",
//   );

//   if (!createdUser) {
//     throw new ApiError(501, "User creation failed!");
//   }

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         200,
//         createdUser,
//         "User Creation/Registration Successful",
//       ),
//     );
// });

// export { registerUser };
