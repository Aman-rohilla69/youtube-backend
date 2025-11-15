import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId); // Find the user by ID in the database
    const accessToken = user.generateAccessToken(); // This method should be defined in your User model to generate an access token
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // Save the refresh token in the user document
    await user.save({ validateBeforeSave: false }); // Save the user document with the new refresh token in the database
    // validateBeforeSave: false is used to skip validation for the refreshToken field, as it is not required during user registration or login
    // This is useful when you want to update the user document without triggering validation errors for fields that are not required at that moment
    return { accessToken, refreshToken }; // Return both tokens
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong! while generating refresh and access tokens",
    );
  }
};

// registration func:-
const registerUser = asyncHandler(async (req, res) => {
  // registerUser Steps :-
  // get users details from frontend
  // validation :- not empty , check krna ki sb thik h.. ya nhi
  // check if user alreday exists : username, email se
  // check for images, check for avatar validation
  // agar ye images available h.. toh cloudinary pr bhej doh, fir isme check kro ki avatar h.. ya nhi
  // create user object  :- create entry in db
  // remove password and refresh token from response / to user
  // check kro ki user create hua ki nhi /response aaya ki nhi
  // agar hoo gya to response bhej do frontend ko ki user create ho gya
  //  agar nhi hua to error bhej do

  // req.body ka kya use h..?
  // req body ka mtlb h.. frontend se user backend pr request bhejta h.. json mai.

  const { fullName, email, username, password } = req.body;
  // console.log(req.body);
  // some() ka use h..?
  // ye check karne ke liye ki koi bhi field empty toh nahi hai
  // trim () ka use h..?
  // ye string ke starting aur ending spaces ko remove karne ke liye use hota h..
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "") // toh automatically true return krdega
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exists
  // findOne() ka use h..?
  // ye mongoose ka method h.. jo ki database me se ek document ko find krta h.. based on the given criteria
  // $or ka use h..?
  // ye MongoDB operator h.. jo ki multiple conditions me se kisi ek condition ke true hone pr document ko return krta h..
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }
  // iss condition ko step by step kro
  // check for images
  // req.files ka use h..?
  // ye multer middleware ke through aata h.. jo ki uploaded files ko handle krta h..
  // avatar or coverImage check krna h..
  // ?. ka use h..?
  // ye optional chaining operator h.. jo ki check krta h.. ki object ya property exist krti h.. ya nhi.. agr exist krti h.. toh hi aage access krta h..
  // [0] ka use h..?
  // kyuki multer me files array ke form me aati h.. toh hum first file ko access krne ke liye [0] use krte h..
  // .path ka use h..?
  // ye file ka local path return krta h.. jahan file store hui h..
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(req.files.avatar);
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  // req.files hamare pass aayi h.. ya nhi && fir array aaya h.. ya nhi && or agar req.files array mai h.. toh uski length 0 se bdi honi chaiye..tb  {toh coverimage ke 0th element mai se path nikal lo }
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // console.log(req.files.coverImage);
  // check kr rhe h.. ki avatar file h.. ya nhi
  // coverImage optional h.. toh uske liye check nhi krna h..
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // upload images to cloudinary
  // uploadOnCloudinary ka use krke hum local file ko cloudinary pr upload kr rhe h..
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Error in uploading avatar file");
  }

  // create user object to store in db

  const user = await User.create({
    fullName,
    avatar: avatar.url, // avatar ka url hume cloudinary se milta h.. upload hone ke baad toh uss url ko hi store krna h.. db me
    coverImage: coverImage?.url || "", // coverImage optional h.. toh agr nhi h.. toh empty string store krdo
    email,
    password,
    username: username.toLowerCase(), // username ko lowercase me store krna h.. taaki case sensitivity na ho
  });

  // user object me se password and refreshToken ko remove krke response bhejna h..
  // createdUser me hum user ko dobara se find krke la rhe h.. by id.. taaki hume password and refreshToken na mile
  const createdUser = await User.findById(user._id).select(
    // .select() ka use krke hum specific fields ko include ya exclude kr sakte h.. yahan hum password and refreshToken ko exclude kr rhe h..
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation failed ! while regestering");
  }

  // send response to frontend

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body se data lena h..
  // useke baad check krna h.. ki username or email h.. ya nhi
  // find the user mtlb vo db mai exist krta h.. ya nhi
  // agar user mil jata h.. toh password check krvao
  // agar password shi h.. toh access and refresh token generate honge or
  // user ko send honge..cookies mai

  // req body se data lena h..
  const { email, username, password } = req.body;
  console.log(email);

  // useke baad check krna h.. ki username or email h.. ya nhi
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // find the user mtlb vo db mai exist krta h.. ya nhi.
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "user doesn't exist");
  }

  // agar user mil jata h.. toh password check krvao
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // agar password shi h.. toh access and refresh token generate honge or

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // cookies bhejni h..

  // true krne se ye sirf server se modify hoo sakti h..
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged In successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // remove refreshTokens.
  // remove cookies data.

  // remove refresh token from db :-
  await User.findByIdAndUpdate(
    // req.user._id is the id of the user who is logged in, req.user is set by the verifyJWT middleware
    req.user._id,
    {
      $set: {
        // $set update krne ke liye use hota h.. database mai values ko.
        refreshToken: undefined,
      },
    },
    {
      // new value
      new: true,
    },
  );

  // remove cookies data.
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // req.cookies se refresh token ko fetch kr rhe h.. , req.body se bhi vhi kaam kr rhe h.. agar koi mobile use krta hoo tb.
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised Request");
  }

  // jwt.verify 2 se 3 cheeje leta h.. phela toh token string wala aur secret information mtlb secret tokens.
  try {
    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    // tokens cookies mai bhejne ke liye..
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser,refreshAccessToken };
