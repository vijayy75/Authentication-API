import  express from "express"
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser"; 
import connectDb from './config/mogodb.js';
import { connect } from "mongoose";
import authRouter from './routes/authRoutes.js'

const app = express();
connectDb();
const allowedOrigin=['http://localhost:5173']

app.use(express.json())
app.use(cookieParser());
app.use(cors({origin:allowedOrigin,credentials : true}))
//api end point
app.get
app.use('/api/auth',authRouter)

app.listen(process.env.port,()=>{
    console.log("server is running")
})