import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{type : String, required : true},
    email:{type : String, required : true , unique : true},
    password:{type : String, required : true },
    verifyotp:{type:String , default:''},
    verifyotpexpireAt:{type:Number, default:''},
    isaccountVerified:{type:Boolean, default:false},
    resetOtp:{type:String , default:''},
    resetOtpExpireAt:{type: Number, default:0}
})
const userModel = mongoose.models.user||mongoose.model('user', userSchema)
export default userModel;