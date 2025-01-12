const express=require("express");
const router=express.Router();
const {registerUser,loginUser,logoutUser}=require("../controllers/authController");

/*when you write const { registerUser } = require("../controllers/authController");
, the curly braces {} indicate destructuring. 
This is used to extract specific properties (or methods) from an object. */


router.get("/",(req,res)=>{
    // const error = "";
    // res.render("index",{error})
    res.send("working");
})
router.post("/create",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);

module.exports=router;