import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js"
import cors from "cors"


dotenv.config();

const app=express();

// app.use(cors());
app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization"
  }));
  
// app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE", allowedHeaders: "Content-Type,Authorization" }));

app.use(express.json())  //important note ha it will pass the json data 

app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);
const PORT =process.env.PORT || 3000
app.listen(PORT,()=>{
console.log("server is running at the port number 3000")
connectDB();
})
