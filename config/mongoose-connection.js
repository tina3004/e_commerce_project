const mongoose =require('mongoose');
const config=require('config');
const dbgr=require("debug")("development:mongoose");

/*
"development:mongoose"
development-> all files related to development
mongoose->message will come from this file

Terminal
$env:DEBUG="development:*"

set->env setup
development:* -> development wale saare namespaces
*/ 


mongoose.connect(`${config.get("MONGODB_URI")}/e_commerce_proj`)
    .then(function(){
        dbgr("connected");
    })
    .catch(function(err){
        console.log(err);
    })

module.exports=mongoose.connection;