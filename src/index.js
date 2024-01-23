const express=require("express");
const paths=require("path");
const bcrypt=require("bcrypt");
const collection=require("./config");

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

const port=5000;
app.listen(port,()=>{
console.log(`Server started at port : ${port}`)
})