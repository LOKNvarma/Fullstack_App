import { app } from "./app.js"
import { connectDb } from "./db/index.js"

connectDb()
.then(()=>{
   app.listen(process.env.PORT || 4000,()=>{
    console.log(`server is listening on port : ${process.env.PORT}`);
   })
})
.catch((error)=>{
     console.log("MongoDB connection failed",error);
})
