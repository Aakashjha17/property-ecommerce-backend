import jwt from 'jsonwebtoken'
import User from '../models/user.js';
import dotenv from 'dotenv'
dotenv.config()

const checkUserAuth = async(req,res,next)=>{
    let token
    const { authorization }= req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try{
            //get token from header
            token = authorization.split(' ')[1]

            //VERIFYING TOKEN
            const{userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

            // GET USER FROM TOKEN
            req.user = await User.findById(userID).select('-password') //return all except password
            next()
        } catch(error){
            res.send({"status":"failed","Mesage":"Unauthorized user"})
        }
    }
    if(!token){
        res.send({"status":"failed","Mesage":"Unauthorized user, No token"})
    }
}

export default checkUserAuth;