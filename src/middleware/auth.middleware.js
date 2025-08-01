import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,_,next)=>{
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
            if(!token)throw new ApiError(401,"unAuthorized request");
            const decodeToken =  jwt.verify(token,process.env.ACESS_TOKEN_SECRET);
            const user =  await User.findById(decodeToken._id).select("-password -refreshToken");
            if(!user)throw new ApiError(401,"invalid access token");
            req.user = user ;
            next();
        } catch (error) {
            throw new ApiError(401,
                 error.message || "invalid access token"
            )
        }
})