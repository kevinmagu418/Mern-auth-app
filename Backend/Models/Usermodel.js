import mongoose from "mongoose";

//define schema for the document
 const Userschema= new mongoose.Schema({

    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    lastlogin:{type:Date,default:Date.now},
    isVerified:{type:Boolean,default:false},
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    VerificationToken:String,
    VerificationTokenExpiresAt:Date

 },  {timestamps:true});
 //creating the model
export const User=mongoose.model('User',Userschema)