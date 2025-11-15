import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true, // Removing leading/trailing whitespace
      index: true, // Adding index for faster search
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true, // Removing leading/trailing whitespace
    },
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full name is required"],
      index: true, // Adding index for faster search
    },
    avatar: {
      type: String, // cloudinary URL for the user's avatar image
      required: [true, "Avatar Image is required"],
    },
    coverImage: {
      type: String, // cloudinary URL for the user's cover image
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

// 1 :-

// pre-save middleware to hash password before saving the user document
userSchema.pre("save", async function (next) {
  // this refers to the current user document being saved
  // condition to check if the password field has been not modified
  // agar password field modify nhi hui hai toh next() ko call kar do
  // ! nhi hui hai toh next() ko call kar do
  if (!this.isModified("password")) return next();
  // Password hashing before saving the user document
  // hash doh(2) chezze leta h.. ki kya hash karna h aur kitne rounds me karna h..
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 2 :-

// userSchema ke andar objects hote hain = vo methods jisme hum custom methods define kar sakte hain isPasswordCorrect jese method ko define kiya gaya h..
userSchema.methods.isPasswordCorrect = async function (password) {
  //   bcrypt.compare function ka use karke hum user ke entered password ko hashed password se compare karte hain
  // compare doh chezze leta h.. ki pehla h entered password jo string h.. Aur dusra h hashed password jo database me stored h.. or return true or false krta h..
  return await bcrypt.compare(password, this.password);
};

// 3 :-
// JWT token generation methods
// generateAccessToken ka use kya h..?
// Ye method user ke liye ek access token generate karta hai jo authentication ke liye use hota hai.
userSchema.methods.generateAccessToken = function () {
  // sign method ka use karke hum JWT token generate karte hain ye teen cheeze leta h.. 1 :- payload jisme user ki information hoti h.. 2 :- secret key jo token ko sign karne ke liye use hoti h.. 3 :- options jisme token ka expiry time wagaira set karte hain..
  return jwt.sign(
    {
      _id: this._id, // payload me hum user ka id, email, username, fullName wagaira rakhte hain..
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key jo .env file me stored hoti h..
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // token ka expiry time jo .env file me stored hota h..
    },
  );
};

// 4 :-
// generateRefreshToken ka use kya h..?
// Ye method user ke liye ek refresh token generate karta hai jo access token expire hone ke baad naya access token lene ke liye use hota hai.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, // payload me hum user ka id, email, username, fullName wagaira rakhte hain..
    },
    process.env.REFRESH_TOKEN_SECRET, // secret key jo .env file me stored hoti h..
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, //token ka expiry time jo .env file me stored hota h.
    },
  );
};
export const User = mongoose.model("User", userSchema);
