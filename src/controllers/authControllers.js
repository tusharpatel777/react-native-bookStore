
import { User } from "../models/User.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();


const generateToken=(userId)=>{
  return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"});

}
export const register= async(req,res)=>{
 
    // console.log("thsi is the signup router");
    try {

        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
    
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 character"});
        }
        if(username.length<3){
            return res.status(400).json({message:"username must contain atleast 3 character"})
        }
    
        const existingEmail=await User.findOne({email});
    
        if(existingEmail){
            return res.status(400).json({message:"email is already is exist"});
        }
    
        const existingUsername=await User.findOne({username});
    
        if(existingUsername){
            return res.status(400).json({message:"username is already is exist"});
        }
        
      
        //get an random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    
        const user=new User({
            username,
            email,
            password,
            profileImage,
        })
    
    
        await user.save(); 

        const token=generateToken(user._id); //genrate the token and sent this  to the client

        //this iis what we have to returen while success
        res.status(201).json({
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            },
        })

        
    } catch (error) {

        console.log("error in signup controller ",error.message);
        res.status(500).json({message:"internal server error"})
        
    }
    //..save new user in to the database
}

export const login= async(req,res)=>{

    // console.log("thsi is the signup router");



    try {

        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({messgae:"all fields are required"})
        }


        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"invalid credentials"})
        }

        const isPasswordCorrect=await user.comparePassword(password); 

        if(!isPasswordCorrect){
            return res.satus(400).json({message:"invalid credentials"})
        }
        const token=generateToken(user._id);

        res.status(201).json({
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            }
        })

        
    } catch (error) {

        console.log("erron in login controller ",error.message);
        res.status(500).json({message:"internal server error"})
        
    }
    
}