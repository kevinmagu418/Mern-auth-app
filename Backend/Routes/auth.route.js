//creating an authentication routing server
import express from 'express';
import { login, logout, signUp,verifyEmail,forgotpassword,resetpassword,checkAuth } from '../Controllers/auth.contoller.js';
import { verifyToken } from '../middleware/verifyToken.js';
//creating the router
const router=express.Router();
router.get('/checkAuth',verifyToken,checkAuth);
//crating the various auth routes sign up sign in

router.post('/signup',signUp);

//login route
router.post('/login',login);

//logout route
router.post('/logout',logout);
//verifying if the verification  code matches
router.post('/verify-email',verifyEmail);
//forgotpassword
router.post('/forgot-password',forgotpassword);
router.post('/resetpassword/:token',resetpassword)
export default router;