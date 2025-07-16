import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
        username : {
            type : String ,
            required : true ,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        email : {
            type : String,
            required : true ,
            unique : true,
            lowercase : true,
            trim : true,
            
        },
        fullName : {
            type : String,
            required : true ,
            trim : true,
            index : true
            
        },
        avatar : {
              type : String, // cloudianry
              required : true
        },
        coverImage : {
            type : String , // cloudinary
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password : {
            type : String ,
            required : [ true , "password is required"]
        },
        refreshToken : {
            type : String ,
        }

        
    },{timestamps : true}
)

userSchema.pre("save",async function (next){
   if(this.isModified("password")) return next();
      this.password = await bcrypt.hash(this.password , 10);
      next();
});

userSchema.methods.isPasswordCorrect = async function(password){
       return await bcrypt.compare(password , this.password);
}

userSchema.methods.accessToken = function(){
    return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username : this.username
        },
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACESS_TOKEN_EXPIRY
        }
      )
}
userSchema.methods.RefreshToken = function(){
    return  jwt.sign(
        {
            _id : this._id ,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);