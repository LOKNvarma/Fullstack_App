import { v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

const fileUploadOnCloudinary = async (localFilePath)=>{
    if(!localFilePath)return null;
    try{
        const response =   await cloudinary.uploader.upload(localFilePath,{
          resource_type : "auto"
        });
        return response;

    }catch(error){
          fs.unlinkSync(localFilePath);
          return null
    }
}