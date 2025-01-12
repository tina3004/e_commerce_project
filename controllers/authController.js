const userModel=require("../models/user-model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {generateToken}=require("../utils/generateToken");

module.exports.registerUser= async function(req,res){
    try{
        let {firstName,lastName,email,password,contact}=req.body;
        let user=await userModel.findOne({email:email});
        if (user){
            req.flash("error","User already exists, please login to your account");
            return res.redirect("/");
        }
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async(err,hash)=>{
                if(err) return res.send(err.message);
                else{
                    let user=await userModel.create({
                        firstName,  
                        lastName,
                        email,
                        password:hash,
                        contact
                    })
                    let token =generateToken(user);
                    res.cookie("token",token);
                    let success=req.flash("success","User created successfully");  
                    res.redirect("/");                  
                }
            })
        })

    }
    catch(err){
        res.send(err.message);
    }
}

module.exports.loginUser=async function(req,res){
    try{
        let {email,password}=req.body;
        let user=await userModel.findOne({email});

        if(!user){
            req.flash("error","Email or password incorrect");
            return res.redirect("/");
        }

        bcrypt.compare(password, user.password,(err,result)=>{
            if(result){
                let token=generateToken(user);
                res.cookie("token",token);
                // res.send("You can login")
                res.redirect("/shop");
            }
            else{
                // return res.send("Email or password incorrect");
                req.flash("error","Email or Password incorrect");
                res.redirect("/");
            }
        })
    }
    catch(err){
        res.send(err.message);
    }
}

module.exports.logoutUser=async function(req,res){
    res.cookie("token","");
    res.redirect("/");
}