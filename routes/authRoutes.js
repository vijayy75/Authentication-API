import express from 'express'
import { isAuthenticted, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controller/auth.js';
import userAuth from '../middelwear/userauth.js';

const authRouter = express.Router();
authRouter.post('/register', register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp)
authRouter.post('/verify-account',userAuth,verifyEmail)
authRouter.get('/is-auth',userAuth,isAuthenticted)
authRouter.post('/send-reset-otp',sendResetOtp)
authRouter.post('/resetPassword',resetPassword)

export default  authRouter