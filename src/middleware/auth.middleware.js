import express from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"


//protect route this mainly useful inorder provide
export const protectRoute=async(req,res,next)=>{
    try {

        //get the token and sen this in the header
        const token=req.header("Authorization").replace("Bearer","");  //getting the token

        if(!token)  return res.status(401).json({message:"No authentications token,access denied"}); //token from the req from client if is not there then we will give error to that  no authentication is provided

        const decoded=jwt.verify(token,process.env.JWT_SECRET);  //verify the token with jwtsecret from which we have make the token using the jwt.sign()
        
        const user=await User.findById(decoded.userId).select("-password") //take user but without the password

        if(!user){
            return res.status(400).json({message:"token is not valid"}) // if user is not present there then send essage that token is not valid
        }
        res.user=user  //this importent  response user me user assign kardiya
        next() //pass to next fuctiion after the checking the authentications
        
    } catch (error) {

        console.log("aithentication error", error.message);
        res.status(401).json({message:"token is not valid"});
        
    }
}