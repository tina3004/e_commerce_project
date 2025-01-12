const express=require("express");
const router=express.Router();
const upload=require("../config/multer-config");
const productModel=require("../models/product-model");
const ownerModel=require("../models/owner-model");

router.post("/create",upload.single("image"),async (req,res)=>{
    try{
        const OWNER_ID = "677262f09f75c9297beb442e";
        let{name,image,price,discount,bgcolor,panelcolor,textcolor}=req.body;

        let isNew =req.body.isNew ? true:false;
        let product=await productModel.create({
            image:req.file.buffer,
            name,price,discount,bgcolor,panelcolor,textcolor,
            isNew,
        })
        req.flash("success","Product created successfully");

        const owner = await ownerModel.findById(OWNER_ID);
        if(owner){
            owner.products.push(product._id);
            await owner.save(); 
        }
        
        res.redirect("/owners/admin");
    }catch(err){
        res.send(err.message);
    }
})
module.exports=router;