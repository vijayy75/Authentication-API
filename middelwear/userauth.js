import jwt from "jsonwebtoken"
const userAuth = async(req,res,next)=>{
    const{token}=req.cookies;
    if(!token){
        res.json({success: false, message:'Login again'})
    }
    try{
       const tokenDecode= jwt.verify(token,process.env.Jwt_secreat);
       if(tokenDecode.id){
        req.body.userId=tokenDecode.id
       }else{
        return res.json({success:false , message:'Login Again'})
       }
       next();

    }catch(error){
        res.json({success:false , message:error.message}); 
    }

}
export default userAuth;