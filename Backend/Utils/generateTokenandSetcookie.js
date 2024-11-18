    import jwt from 'jsonwebtoken'
    export const generateTokenandsetcookie=(res,userId)=>{

    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'});
//name of the cookie,jwt token,options
    res.cookie('Authtoken',token,{httpOnly:true, secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:7*24*60*60*1000})

    return token;
   }
