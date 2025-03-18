import express, { json } from "express"
// import { getBooks } from "../controllers/bookControlles.js";
import cloudinary from "../lib/cloudinary.js";
import { Book } from "../models/Book.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/",protectRoute,async(req,res)=>{
    try {
        
        //getting the all field form the req that user made
        const {title,caption,rating,image}=req.body;
        
        //any one from this is missing that in it will guve the error
        if(!image || !caption || !title || !rating || !image){

            return res.status(400).json({message:"all fields are required"});

        }
       //upload the image on to the cloudinary that you have gotten from the  users req
       const uploadResponse= await cloudinary.uploader.upload(image);
       const imageURL=uploadResponse.secure_url;   //convert this into the URL format 


       //create the new Book 
       const newBook=new Book({
        title,
        caption,
        rating,
        image:imageURL,
        user:req.user._id
       })
     
      //save this into the database
       await newBook.save();
      
       //returnig the response as the newbook
       res.status(201).json(newBook);

        
    } catch (error) {
        
        //this is the erroe that we have gotten
        console.lof("error ",error.message);
        res.status(500).json({messaage:"internal server error"})
        
    }
});

//get all the books 
router.get("/",protectRoute,async(req,res)=>{
    try {
        //this is some logic to display the book 
        const page=req.query.page || 1;
        const limit=req.query.limit || 5;
        const skip=(page-1)*limit;
        const books=await Book.find().sort({createdAt:-1}).skip(skip).limit(limit).populate("user","username profileImage");
        const totalBooks=await Book.countDocuments();
      
        res.send({
            books,
            currentPage:page,
            totalBooks,
            totalPages:Math.ceil(totalBooks/limit)
        });
        
    } catch (error) {

        console.log("error in the getting all the books",error.message);
        res.status(500).json({message:"internal server error"});
        
    }

})

//deleting the book 
//protect router is there is ensure thatonly authenticated user can delete the post
router.delete("/:id",protectRoute,async(req,res)=>{
    try { 
    const book=await Book.findById(res.params.id);
    if(!book) return res.status(404),json({message:"Book not found"});
    
    //we need to check that we are owner of this book or not
    if(book.user.toString()!==req.user._id.toString()){  //this will check are we the owner of that book or not if not that send message unauthorized
        return res.status(401).json({message:"unauthorized"})
    }
    //delete the image form the cloudinary 
    //if yes we are the owner of that bookk that we can delete that particular book

    //first delete the image from that
    if(book.image && book.image.includes("cloudinary")){
        try {
            const publicId=book.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
            
        } catch (deleteError) {
            console.log("Error in deleting the image form the cloudinary",deleteError)
            
        }
    }

    //then delete the book post from  the database

    await book.deleteOne(); //delete the post but we didnt deleted the image form the cloudinar
    res.json({messaage:"Bool deleted successfully"});
            
        } catch (error) {

            console.log("error in the deleting the book ",error.message);
            res.status(500).json({message:"internal server error"})
            
        }

})

//getting all the users 

router.get("./user",protectRoute,async(req,res)=>{
    try {

        const books=await Book.find({user:req.user._id}).sort({createdAt:-1});  //find the users and sort them according to such that time they have createdAT
        res.json(books); // response me books bhej di
        
    } catch (error) {

        console.log("get users book error ", error.message);
        res.status(500).json({message:"internal server error"})
        
    }
})
export default router;