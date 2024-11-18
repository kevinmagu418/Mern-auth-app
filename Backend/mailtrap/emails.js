
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient,sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplate.js";

import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";

//we want to send the verification email
//function to send the verificationemail
export const sendVerificationEmail=async(email,verificationToken)=>{
   const recipient=[{email}];


   try{

    const responseEmail=await mailtrapClient.send({
         from:sender,
         to:recipient,
         subject:'verify your Email',
         html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
         category:'Email verification'

    })

    console.log('Email sent successfully',responseEmail)
   }
   catch(error){
console.error(error);

   }
}

//welcome email 
export const sendWelcomeEmail=async(email,username)=>{
   try{
    const recepient=[{email}];
    await mailtrapClient.send({
       to:recepient,
       from:sender,
       template_uuid: "e685e6d2-c039-4b30-acc0-42db77495cd8",  
       template_variables: {
         "company_info_name": "KevinMagu org",
         "name": username
       },
       category:'welcomEmails'
    });
    
   }
   catch(error){
     console.error('error sending welcome email',error)
    
   }
}


//send the passwordresetemail

export const sendpasswordResetEmail= async(email,resetURl)=>{   
   const recepient=[{email}];
 try{

       const response=await mailtrapClient.send({
            to:recepient,
            from:sender,
            subject:"Reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURl),
            category:'password reset'
       })



 }
catch(error){
console.error("error sending reset email",error);

}
}

export const sendResetSuccessEmail=async(email)=>{
  const recepient=[{email}];
 try{  
   const response= await mailtrapClient.send({
      to:recepient,
      from:sender,
      subject:'Succcessful Reset',
      html:PASSWORD_RESET_SUCCESS_TEMPLATE,
      category:'successfulreset'

   })
 }
catch(error){

   console.log('error sending success email',error);
}


}