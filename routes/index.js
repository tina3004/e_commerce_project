const express=require('express');
const router=express.Router();
const isLoggedIn=require("../middlewares/isLoggedIn");
const productModel=require("../models/product-model");
const userModel = require('../models/user-model');


router.get("/",(req,res)=>{
    let error=req.flash("error");
    let success=req.flash("success");
    res.render("index.ejs",{error, loggedIn:false,success});
})

router.get("/shop",isLoggedIn,async(req,res)=>{
    let products=await productModel.find();
    let success=req.flash("success");
    res.render("shop.ejs",{products,success});
})

router.get("/addtocart/:productid",isLoggedIn,async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","Added to cart");
    res.redirect("/shop");   
})

router.get("/cart",isLoggedIn,async(req,res)=>{
    let user =await userModel.findOne({email:req.user.email}).populate("cart");
    let finalamt=0;
    let amt=0;
    if(!user){
        req.flash("Cart is empty");
        return res.render("cart",{finalamt:0});
    }
    user.cart.forEach(function(val){
        amt+=(val.price);
        finalamt+= (val.price) - val.discount;
    })    
    res.render("cart",{user,amt,finalamt});
})

router.get("/remove-from-cart/:productid",isLoggedIn,async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    user.cart.splice(req.params.productid,1);
    await user.save();
    req.flash("Removed from cart");
    res.redirect("/cart");
})

router.get("/profile",isLoggedIn,async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    res.render("accountInfo",{user});
})

router.get("/discounted-products",isLoggedIn,async(req,res)=>{
    let products=await productModel.find({discount:{$gt:0}});
    res.render("discountedProducts",{products,user:req.user});
})

router.get("/new-collection",isLoggedIn,async(req,res)=>{
    let products=await productModel.find({isNew:true});
    res.render("newCollection",{products,user:req.user});
})

module.exports=router;
