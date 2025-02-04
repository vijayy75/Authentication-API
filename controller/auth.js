import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../model/usermodel.js';
import transporter from '../config/nodeMailer.js';


export const register = async (req, res) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        res.json({ success: false, message: "missing detail" })
    }
    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "user already exist" })
        }
        const hasedPassword = await bcrypt.hash(password, 5)

        const user = new userModel({ name, email, password: hasedPassword });
        await user.save()


        //generate token
        const token = jwt.sign({ id: user._id }, process.env.Jwt_secreat, { expiresIn: "7d" });


        //sending token from coockie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        // sending email
        const  mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject:'welcome from vijays website',
            text:`Your account is created from this email:${email}`
        }
        return res.json({ success: true });
      

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) {
        return res.json({ success: false, message: "email and passwor required" })
    }
   
    try {
        const user = await userModel.findOne({ email });
       
        if (!user) {
            return res.json({ success: false, message: 'invaid email' })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'password is incoorect' })
        }
        const token = jwt.sign({ id: user._id }, process.env.Jwt_secreat, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000

        })
        
        return res.json({ success: true })
       

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
        return res.json({ success: true, message: 'you are loged out' })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const sendVerifyOtp =  async(req,res)=>{
    try{
       const{userId}= req .body;
       const user = await userModel.findById(userId);
       if(user.isaccountVerified){
        return res.json({success:false,message:"Account is already veriffied"})
       }

       const otp =Math.floor(100000 +Math.random()*900000).toString();
       user.verifyotp = otp;
       user.verifyotpexpireAt =Date.now()+24*60*60*1000
       await user.save();

       const mailOptions={
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject:'Account Verifaction OTP',
        text:`your OTP 
        
        
        
        
        ${otp} . verify using this otp`
       }
       await transporter.sendMail(mailOptions);
      return res.json({success: true, message: 'Verifaction OTP sent on email'})

    }catch(error){
        return res.json({ success: false, message: error.message })   
    }
}

export const verifyEmail = async (req, res)=>{
    const {userId, otp}= req.body;

    if(!userId || !otp ){
        return res.json({success:false, message: 'Missing details'});
    }

    try{
        
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message:'user not found'})
        }
        if(user.verifyotp==='' || user.verifyotp!==otp){
            return res.json({success: false, message:'invalid otp'}) 
        }

        if(user.verifyotpexpireAt<Date.now()){
            return res.json({success: false, message:'OTP is Expired'})
        }
        user.isaccountVerified= true;
        user.verifyotp='';
        user.verifyotpexpireAt=0;

        await user.save();
       return res.json({success: true, message:'Email verified successfull'})

    }catch(error){
        return res.json({success:false, message: error.message});
    }
    

}
export const isAuthenticted = async(req,res)=>{
    try{
        return res.json({success:true})
    }catch(error){
        res.json({success:false, message:error.message})
    }
} 

//send passwordreset otp
export const sendResetOtp= async(req,res)=>{
    const {email}= req.body;
    if(!email){
        return res.json({success:false,message:'email is required'})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false,message:'User not found'})
        }
        const otp = Math.floor(100000 +Math.random()*900000).toString();
       user.resetOtp = otp;
       user.resetOtpExpireAt =Date.now()+24*60*60*1000
       await user.save();

       const mailOptions={
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject:'Password reset OTP',
        text:`your OTP ${otp} . to reset the password`
       }
       await transporter.sendMail(mailOptions);
        return res.json({success: true, message: ' OTP sent on email'})

    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const resetPassword = async (req,res)=> {
    const {email,otp,newPassword} = req.body;

    if(!email || !otp || !newPassword){
       return res.json({success:false,message:'email,otp,password is required'})
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'user not find'})
        }
        if(user.resetOtp === "" || user.resetOtp !== otp.toString()){
            return res.json({success:false,message:'invalid otp'})
        }
        if(user.resetOtpExpireAt< Date.now()){
            return res.json({success:false,message:'OTP has expeird'})
        }
        const hasedPassword=await bcrypt.hash(newPassword,10)
        user.password=hasedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();

        return res.json({success:true,message:'Password has successfully changed'})

    }catch(error){
        return res.json({success:false,message:error.message})
    }

}