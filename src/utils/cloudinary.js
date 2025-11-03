import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
// cloudinary.config() ka use krke hum apne cloudinary account ko configure krte hain
// jisme hum cloud_name, api_key, api_secret provide krte hain jo humare .env file me stored hote hain
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    // cloudinary.uploader.upload() ka use krke hum apne local file ko cloudinary par upload kr rhe h.
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    fs.unlinkSync(localFilePath);
    return response;

    // ab hum local file ko delete kr denge fs.unlinkSync() ka use krke
  } catch (error) {
    // fs.unlinkSync() ka mtlb hai ki yeah kaam hona hee chahiye chahe upload successful ho ya na ho.
    // kbhi agar upload me error aata hai to bhi hum local file ko delete kr denge
    fs.unlinkSync(localFilePath); // delete the local file in case of error
    console.error("Error in uploadOnCloudinary:", error);
    throw error;
  }
};
export { uploadOnCloudinary };
