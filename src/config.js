// const mongoose = require("mongoose");
import mongoose from "mongoose";

const connect = mongoose.connect("mongodb://localhost:27017/Togethr");

connect.then(() => {
    console.log("Database connected successfully");
})
.catch(() => {
    console.log("Error in connecting to the database");
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {  // Added missing colon here
        type: String,
        required: true
    }
});

const collection =new mongoose.model("Togethr",LoginSchema,"Togethr");
// module.exports=collection;
export default collection;
