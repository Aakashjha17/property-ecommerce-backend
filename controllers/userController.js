import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

class UserController{

    //registration
    static userRegistration = async(req,res)=>{
        try{
            const {name, email, password, password_confirmation}=req.body;
            const user = await User.findOne({email:email})
            if(user){
                return res.status(403).json({success: false, message:"Email already exist"})
            }else{
                if(name && email && password && password_confirmation){
                    if(password===password_confirmation){
                        try{
                            const salt=await bcrypt.genSalt(12)
                            const hashed_password = await bcrypt.hash(password, salt)
                            const newUser=new User({
                                name:name,
                                email:email,
                                password:hashed_password,
                            })
                            await newUser.save()
                            const saved_user= await User.findOne({email:email})
                            //Generating JWT TOKEN
                            const token=jwt.sign({userID:saved_user._id},`${process.env.JWT_SECRET_KEY}`,{expiresIn:'5D'})
                            return res.status(201).json({
                                success: true, 
                                message:"User registerd successfully",
                                "UserData": {
                                    "_id": newUser._id,
                                    "email": newUser.email,
                                    "name": newUser.name,
                                    "token": token,
                                }
                            })
                        } catch(error){
                            return res.status(403).json({success: false, message:"Unable to register","error":error})
                        }
                    }else{
                        return res.status(401).json({success: false, message:"password doesn't match"})
                    }
                }else{
                    return res.status(400).json({success: false, message:"All fields are required"})
                }
            }
        }catch(error){
            return res.status(500).json({success: false, message:"Something unexpected happened","error":error})
        }
    }

    //LOGIN
    static userLogin = async(req,res)=>{
        try{
            const {email,password} = req.body;
            if(email && password){
                const user=await User.findOne({email:email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if(user.email=== email && isMatch){
                        //Generating JWT TOKEN
                        const token=jwt.sign({userID:user._id},`${process.env.JWT_SECRET_KEY}`,{expiresIn:'5D'})
                        return res.status(200).json({
                            success: true, 
                            message:"success",
                            "UserData": {
                                "_id": user._id,
                                "email": user.email,
                                "name": user.name,
                                "token": token,
                            }
                        })
                    }else{
                        return res.status(401).json({success: false, message:"Email or password doesn't match"})
                    }
                }else{
                    return res.status(404).json({success: false, message:"Email doesn't exist"})
                }
            }else{
                return res.status(400).json({success: false, message:"All fields are required"})
            }
        }catch(error){
            return res.status(500).json({success: false, message:"Something unexpected happened","error":error})
        }
    }

    //PASSWORD CHANGE
    static userChangePassword=async(req,res)=>{
        try{
            const {password,password_confirmation}=req.body;
            if(password && password_confirmation){
                if(password===password_confirmation){
                    const salt=await bcrypt.genSalt(12)
                    const hashed_password = await bcrypt.hash(password, salt)
                    await User.findByIdAndUpdate(req.user._id,{$set: {password:hashed_password}})
                    return res.status(200).json({success: true, message:"password change successfully"})
                }else{
                    return res.status(401).json({success: false, message:"password doesn't match"})
                }
            }else{
                return res.status(400).json({success: false, message:"All fields are required"})
            }
        }catch(error){
            return res.status(500).json({success: false, message:"Something unexpected happened","error":error})
        }
    }

    //new password
    static userPasswordReset = async(req,res) =>{
        try{
            const {password,password_confirmation} = req.body
            const {id, token} = req.params
            const user = await User.findById(id)
            const new_secret = user._id + process.env.JWT_SECRET_KEY
            try{
                jwt.verify(token,new_secret)
                if( password && password_confirmation ){
                    if(password === password_confirmation){
                        const salt=await bcrypt.genSalt(12)
                        const hashed_password = await bcrypt.hash(password, salt)
                        await User.findByIdAndUpdate(user._id,{$set: {password:hashed_password}})
                        return res.status(200).json({success: true, message:"password reset successfully"})
                    }else{
                        return res.status(401).json({success: false, message:"Password should match"})
                    }
                }else{
                    return res.status(403).json({success: false, message:"All field are reuired"})
                }
            } catch(error){
                return res.status(403).json({success: false, message:"Invalid token","error":error})
            }
        }catch(error){
            return res.status(500).json({success: false, message:"Something unexpected happened","error":error})
        }
    }
}

export default UserController;