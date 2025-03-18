import mongoose from "mongoose";
import bcrypt from "bcryptjs"

//users schema  all the attributes foe the userSchema username, email, password
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        
    },
    profileImage:{
        type:String,
        default:""
    }
},{timestamps:true});


//these are some important funtion derived here this one for the hash the password that user have sent in the req
// userSchema.pre("save",async function(next){

//     if(!this.isModified("password"))  return next();
//     const salt=await bcrypt.genSalt(10);
//     this.password=await bcrypt.hash(this.password,salt);
//     next();
// })
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword=async function(userPassword){
    return await bcrypt.compare(userPassword,this.password); //return true or false   //this is mainly useful inorder to check for the userpasswird == the passwird that is stored in the database
}

export const User=mongoose.model("User",userSchema);  //export the UserSchema
