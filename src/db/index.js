import "dotenv/config"
import  {DB_NAME } from "../constants.js"
import mongoose from "mongoose";
         
const connectDb = async()=>{
      try{
        const connectionInstance =   await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connect on host : ${connectionInstance.connection.host}`)
      }catch(error){
        console.log("Mongodb connection failed : ",error);
      }
}
export {connectDb} ;