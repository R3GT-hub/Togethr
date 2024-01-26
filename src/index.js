// const express=require("express");
// const paths=require("path");
// const bcrypt=require("bcrypt");
// const collection=require("./config");
// import express from "express";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
// import puppeteer from "puppeteer";


import express from "express";
import paths from 'path';
import bcrypt from 'bcrypt';
import collection from "./config.js";
import puppeteer from "puppeteer";
const config = new OpenAI({
    apiKey: "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",
});
const openai = new OpenAI(config);

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs')
app.use(express.static("public"));
app.get('/',(req,res)=>{
    res.render("login");
})
app.get('/login',(req,res)=>{
    res.render("login");
})
app.get('/signup',(req,res)=>{
    res.render("signup");
})

app.post("/signup",async (req,res)=>{
    const data={
        name:req.body.username,
        password:req.body.password
    }

    const existegUser=await collection.findOne({name:data.name});
    if(existegUser){
        // res.send("User already exist try another name");
        res.render("login");
    }
    else{
    const saltRounds=10;
    const hashPassword=await bcrypt.hash(data.password, saltRounds)
    data.password=hashPassword;
    const userdata= await collection.insertMany(data);
    console.log(userdata);
    
    }
})

app.post("/login",async (req,res)=>{
    try{
const check=await collection.findOne({name:req.body.username});
if(!check){
    res.send("user name cannot be found");
}
const isPasswordMatch=await bcrypt.compare(req.body.password,check.password);
if(isPasswordMatch){
    res.render("home");
}
else{
    req.send("Wrong password")
}
    }
    catch{
res.send("Wrong detail");
    }
})

app.get("/scrap", async (req, res) => {
    console.log("started...");
    
    const userSearch = req.query.search || "dell%20inspiron"; // Default to "dell%20inspiron" if no search query is provided
    const url = `https://www.zdnet.com/search/?q=${userSearch}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const allreviews = await page.evaluate(() => {
        const reviews = document.getElementsByClassName(" item");
        return Array.from(reviews).map((node) => {
            const para = node.innerText;
            console.log("paras are: ", para);
            return { para };
        });
    });

    res.json({ value: allreviews });
})

const port=5000;
app.listen(port,()=>{
console.log(`Server started at port : ${port}`)
})