  import jwt from 'jsonwebtoken'
  
  export const verifyToken=(req,res,next)=>{
 //confirming if the token was signed by the user secretkey
const  token=req.cookies.token;
  if(!token) return res.status(401).json({success:false,message:'unauthorized no token provided'})
   
    try{
//decoding the token using the secret key
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) return res.status(400).json({success:false,message:"unAuthorized-invalidToken"})
        req.userId=decoded.userId;

       next();

    }
    catch(error){
      console.log("Error in verify token",error);

return res.status(500).json({suuccess:false,message:"server error"});


    }
}