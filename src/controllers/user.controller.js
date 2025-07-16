import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { fileUploadOnCloudinary } from "../service/cloudinary.js";
import { ApiResponse } from "../utils/Respons.js";

const generateAccessAndRefreshTokens = async function(objectId){
        try{
            const user = await User.findOne(objectId);
            const accessToken = user.accessToken();
            const refreshToken = user.RefreshToken();
            return { accessToken , refreshToken }
        }catch(error){
            throw new ApiError(500,"something went wrong while generating access or refresh tokens");
        }
}

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
    // const avatarLocalPath = req.files?.avatar[0]?.path ;
     

    let avatarLocalPath ; // classical way to check path.... 
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = req.files.avatar[0].path ;
    }

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

const loginUser = asyncHandler(async(req,res)=>{
       // {username , email} = req.body
       // validation
       // check user in mongodb
       //  check user 
       // check password 
       // access and refresh token 
       // response

       const { username, email , password} = req.body;
       if(!(username || email))throw new ApiError(400,"username or email is required");
       const user = await User.findOne({
          $or : [{username},{email}]
       });
       if(!user)throw new ApiError(404 ,"user not exist ");
       const isValid = await user.isPasswordCorrect(password);
       if(!isValid)throw new ApiError(401,"Invalid user credentail");
       const {refreshToken , accessToken } = generateAccessAndRefreshTokens(user._id);
       user.refreshToken = refreshToken ;
       user.save({validateBeforeSave: false});
       const loggedInUser = await User.findOne(user._id).select("-password -refreshToken");

       const options = {
         httpOnly : true ,
         secure: true
       }
       
       return res.status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
        new ApiResponse(200,
            {
            data : loggedInUser ,
            accessToken,
            refreshToken
           },
           "user logged In successfully"
        )
       )
   
});

const logOut = asyncHandler(asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(req.user._id,{$set : {refreshToken : undefined}},{new : true});
        const options = {
            httpOnly:true,
            secure : true
        }
        return res.statu(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            200 ,
            {},
            "user logout successfully"
        )
}));

export {

     registerUser,
     loginUser,
     logOut
}