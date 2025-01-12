const express=require("express");
const router=express.Router();
const ownerModel=require("../models/owner-model");
const isLoggedIn=require("../middlewares/isLoggedIn")

/* $env:NODE_ENV ="development"  -> node environment set to development
NODE_ENV is the environment variable which is set to development

These env are stored in the memory not even in the env file

create route should only be available in development environment
*/

//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==='development'){
    router.post("/create",async function(req,res){
        let owner=await ownerModel.find();
        if(owner.length >0) {return res.status(503).send("You don't have permission to create a new owner");}
        
        let{fullname,email,password}=req.body;
        let createdOwner=await ownerModel.create({
            fullname,
            email,
            password,
        })
        res.send(createdOwner);
    })  
}
router.get("/admin",(req,res)=>{
    let success=req.flash("success");
    res.render("createProducts",{success});
})

router.get("/admin/edit/:id",isLoggedIn,async(req,res)=>{
    console.log(req.params.id);
    let product=await productModel.findOne({_id:req.params.id});
    console.log(product);
    res.render("editProduct",{product})
})

router.post("admin/update/:id",isLoggedIn,async(req,res)=>{
    try{
        const {name,image,price,discount,bgcolor,panelcolor,textcolor,isNew}=req.body;
        let product=await productModel.findOneAndUpdate({_id:req.params.id},{name,image,price,discount,bgcolor,panelcolor,textcolor,isNew});

        if(!product){
            req.flash("error","Product not found");
            return res.redirect("/owners/admin");
        }
        req.flash("success","Product Updated Successfully");
        res.redirect("/owners/admin");
    }
    catch(err){
        req.flash("error","Unable to update product");
        return res.redirect("/owners/admin");
    }
})


module.exports=router;