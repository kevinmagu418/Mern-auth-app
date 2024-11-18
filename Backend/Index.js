import express from 'express';
import authRoutes from './Routes/auth.route.js'
import { connectDb } from './ConnectDb.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';//inorder to acess connection string  in the server
dotenv.config();
const app=express();//
app.use(express.json());

//to parse incoming  requests to json payloads .making it accesible in req.body
app.use(cookieParser());//allows us to parse incoming cookies

app.use('/api/auth',authRoutes);




const Port=  3000;
//set a port to actively listen for requests
app.listen(Port,()=>{
    connectDb();
    console.log('port is actively listening for requests')
})
