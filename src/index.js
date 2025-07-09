import express from "express"
import "dotenv/config"
import { connectDb } from "./db/index.js"
const app = express();
connectDb();
app.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`)
});

