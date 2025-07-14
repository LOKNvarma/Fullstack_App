import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { fileUploadOnCloudinary } from "../service/cloudinary.js";
import { ApiResponse } from "../utils/Respons.js";

const registerUser = asyncHandler(async(req,res)=>{
    const { username,fullName,email , password} = req.body ;
    if(
        [ username, email,  fullName, password ].some((field)=>(field?.trim() == ""))
    ){throw new ApiError(400, "All fields are required")};
    const existedUser =  await User.findOne({
        $or : [ { username },{ email } ] 
    }); 
    if(existedUser){
        throw new ApiError(409, "User with email or username is exist");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path ;
     

    // // let avatarLocPath ;  classical way to check path.... 
    // // if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
    // //     avatarLocPath = req.files.avatar[0].path ;
    // // }

    const coverImageLocalPath = req.files?.coverImage[0]?.path ;
    if(!avatarLocalPath)throw new ApiError(400,"avatar is required");
    const avatar =  await fileUploadOnCloudinary(avatarLocalPath);
    if(!avatar) throw new ApiError(400,"avatar is required");
    if(!coverImageLocalPath)throw new ApiError(400,"coverImage is required");
    const coverImage =  await fileUploadOnCloudinary(coverImageLocalPath);
     if(!coverImage) throw new ApiError(400,"coverImage is required");

    const user = await User.create({
        fullName : fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email : email ,
        password : password,
        username : username.toLowerCase()

    }) ;
    const createdUser =  await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser)throw new ApiError(500,"something went wrong while registering the user");
 
    res.status(200).json(
        new ApiResponse(201,createdUser , "user register successfully")     
    )
});

export { registerUser }