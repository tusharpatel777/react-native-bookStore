import mongoose from "mongoose"

//this is the schema of the book all the attributes that is needed in the book schema is there 
const bookSchema=new mongoose.Schema({


   title:{
        type:String,
        required:true,

    },
    caption:{
        type:String,
        required:true,

    },
    image:{
        type:String,
        required:true,

    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,  //owner of the that book would also be there this for him only
        ref:"User",
        required:true
    }
    



},{timeseries:true});

export const Book=mongoose.model("Book",bookSchema);
