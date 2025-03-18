import mongoose from "mongoose"

//connectDB
export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO DB is connected");
    } catch (error) {

        console.log("error in the conncting the databases");
        process.exit(1);
        
    }
}