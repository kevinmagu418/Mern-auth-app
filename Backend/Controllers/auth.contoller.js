import { User } from "../Models/Usermodel.js";
import bcryptjs from 'bcryptjs';
import crypto  from 'crypto';
import { generateVerificationToken } from "../Utils/generateVerficationtoken.js";
import {generateTokenandsetcookie} from '../Utils/generateTokenandSetcookie.js'
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendpasswordResetEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import { sendResetSuccessEmail } from "../mailtrap/emails.js";
export  const signUp= async(req,res)=>{
    console.log(req.body);
//deconstruct the parameters from the request body
    const {email,password,name}=req.body;
    
    try{
//if any of the fields   are empty
        if(!email || !password || !name){

        return res.status(400).json({ success: false, message: 'All fields are required' });

        }
  // check  if the user already exists in the database.bylookinng through the user collection
  const userAlreadyExists= await User.findOne({email});

    
 if(userAlreadyExists){
   return res.status(400).json({success: false ,message:'userAlreadyExits'})
 }


 //hashing the password using bcryptjs .12 as the salt number
 const hashedPasword=await bcryptjs.hash(password,12);

const VerificationToken= generateVerificationToken();

//once the user is verified create new user document
 const user=new User({
     email,
     password:hashedPasword,
     name,
     VerificationToken,
     VerificationTokenExpiresAt:Date.now() +24*60*60*1000


 })
 //await for the user to be saved
await user.save();
generateTokenandsetcookie(res,user._id);
await sendVerificationEmail(user.email,VerificationToken);

res.status(201).json({message:'user registered succesfully',success:true, user:{...user._doc,password:null}});
    }
    catch (error){
    res.status(400).json({message:error.message,success:false});
    }
}
export const login= async(req,res)=>{
    //user already exists in the database.login using email and a password
    const{email,password}=req.body;
//verifying the email  if such a user exists

try{
    const user=User.findOne({email});
      if(!user){
           return res.status(400).json({success:false,message:'invalid credentials'});
      }
//verify if entered matches the hashed password.it first decodes it and then matches it
const ispasswordValid=await bcryptjs.compare(password,user.password);
    if(!ispasswordValid){return res.status(400).json({success:false,message:'invalid credentials'});}
  
      generateTokenandsetcookie(res,user._id);
     user.lastlogin=new Date();
    await user.save();// returns a promise that resolves once the document is updated
}
catch(error){  console.error('error login',error);}
}

export const logout= async (req,res)=>{
    //logging out just means token ceases to exit clear the token from the cookie
     res.clearcookie('Authtoken');
    res.status(200).json({success:true,message:'successfully logout user'});

}
export const verifyEmail=async(req,res)=>{
    const {code}=req.body;//retrieve the code from the request body

    //verify if thecode matches the one in the database
    try{
           // check if the code is matching and checks if it has expired is it greater than the expiry date
        const user= await User.findOne({VerificationToken:code,VerificationTokenExpiresAt:{$gt:Date.now()}});
        // if the user doesnot fulfill
        if(!user){
            return res.status(400).json({success:false,message:"invalid or expired verification code"})
        }

       //if the code matches  no need for verification
         user.isVerified=true;
         user.VerificationToken=undefined;
         user.VerificationTokenExpiresAt=undefined;

         //update the user info

          await user.save();

          //send the welcome email after successfully verifying the email
          await sendWelcomeEmail(user.email,user.name);

        return res.status(200).json({success:true,message:'WelcomeEmail sent successfully'})
    }


    catch (error){
      return res.status(400).json({success:false,message:'Error sending welcome emails'});
    }
}

//forgot password auth controller

export const forgotpassword =async(req,res)=>{
    //client enters an email that will be used to resnd the email

    const {email}=req.body;
    try{
      const user= await User.findOne({email}) ;//checking for validity of the email
      if(!user){

        return res.status(400).json({success:false,message:"user not found"});
        
      }
      //if the user exits generate a reset token using the crypto
        const resetToken=crypto.randomBytes(20).toString("hex");

        const resetTokenExpiresAt=Date.now()+0.5*60*60*1000; //expires after 30mins

        user.resetPasswordToken=resetToken;
        user.resetPasswordExpires=resetTokenExpiresAt;
        
        await user.save();//update the database
        await sendpasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({success:true,message:"Password reset  link sent to your email"});
    }
    catch(error){  

      console.log("error in forgot password",error);
      res.status(400).json({success:false,message:error.message});
    };
}

export  const resetpassword=async(req,res)=>{

  try{
      const {token}=req.params;
      const {password}=req.body;//newly created password
      const user=await User.findOne({
            resetPasswordToken:token,//checking if the user with that  token exists and if the token is still valid
            resetPasswordExpires:{$gt:Date.now()}

      })
if(!user){

return res.status(400).json({success:false,message:'invalid or expired rest token'})

}
const hashedPasword=await bcryptjs.hash(password,10);

user.password=hashedPasword;
user.resetPasswordToken=undefined;
user.resetPasswordExpires=undefined;
await user.save();
await sendResetSuccessEmail(user.email);
res.status(200).json({success:true,message:'password reset successful'})
  }
  
    
    catch(error){

      console.log('Error in rest password',error);
res.status(400).json({success:false,message:error.message});
  }

}
export const checkAuth= async(req,res)=>{
try{
  const user=await User.findById(req.userId).select("-password");
  if(!user){
    return res.status(400).json({success:false,message:"user not found"});
  }



  res.status(200).json({success:true,user});
}
catch(error){
   console.log("error in checkAuth",error);
   res.status(400).json({success:false,message:error.message});

}



}