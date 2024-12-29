const express=require("express");
const app=express();
const path=require("path");
const cookieParser=require("cookie-parser");
const db=require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.set("view engine","ejs");

app.get("/",(req,res)=>{

})

app.listen(3000);