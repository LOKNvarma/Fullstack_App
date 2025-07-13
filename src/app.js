import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin : process.env.CORS_URI ,
    credentials:true
}));
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true , limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// importing routes here ...
import userRouter from "./routes/user.router.js"

app.use("/apis/v1/users",userRouter);


export { app }