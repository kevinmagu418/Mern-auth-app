//function to connect to the mongo db database
import mongoose from "mongoose"
export  const connectDb=async()=>{
    try{

        console.log(process.env.Mongo_Uri);
    const conn=await mongoose.connect(process.env.Mongo_Uri);
    console.log(`MongoDb connected:${conn.connection.host}`)

    }

    catch(error){

        console.log("error connection to mongodb:" , error.message);
        process.exit(1);//exit with failure
    }
}