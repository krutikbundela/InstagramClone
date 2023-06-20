const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../keys")
// const  requirelogin = require("../middleware/requirelogin")
// const nodemailer = require("nodemailer")
// const sendgridTransport = require("nodemailer-sendgrid-transport")
// const crypto = require("crypto")
// const Sib = require("sib-api-v3-sdk")
// require("dotenv").config()


 

// sendinblueapi = website for email
// 




// router.get("/protected",requirelogin,(req,res)=>{
//     res.send("Hello User")
// })
//testing of middleware,,requirelogin


// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:"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"
//     }
// }))


router.post("/signup",(req,res) => {
    const {name,email,password,pic} = req.body
    if(!email || !password || !name){
      return  res.status(422).json({error:"Please Add All The Fields"})
    }
    User.findOne({email:email})
    .then((savedUser) =>{
        if(savedUser){
            return  res.status(422).json({error:"User Already Exists"})
        }
        bycrypt.hash(password,12)
        .then(hashedpassword =>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
    
            user.save()
            .then(user=>{
                
                res.json({message:"Saved SuccesFully"})
            })
            .catch(err =>{
                console.log(err)
            })
    
        })


        
    })

    .catch(err =>{
        console.log(err)
    })


})




router.post("/signin",(req,res)=>{
    const {email,password} = req.body
    if(!email ||!password){
      return res.status(422).json({error:"Please Add Email Or Password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email Or Password"})
        }
        bycrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"Successfully Sign In"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Password"})
            }
        })
        .catch(err =>{
            console.log(err);
        })

    })


})


// router.post('/reset-pass',(req,res)=>{
//     crypto.randomBytes(32,(err,Buffer)=>{
//         if(err){
//             console.log(err)
//         }
//         const token = Buffer.toString("hex")
//         User.findOne({email:req.body.email})
//         .then(user=>{
//             if(!user){
//                 return res.status(422).json({error:"User Don't Exists"})
//             }
//             user.resetToken = token
//             user.expireToken = Date.now() + 3600000
//             user.save().then((result)=>{
//                 transporter.sendMail({
//                     to:user.email,
//                     from:"no-reply@gmail.com",
//                     subject:"Password Reset",
//                     html: `
//                     <p>You Requested For Password Reset</p>
//                     <h5>click in this <a href="http://localhost:3000/reset/${token}">Link</a> To Reset Password</h5>
//                     `
//                 })
//                 res.json({message:"Check Your Email"})
//             })
//         })
//     })
// })



module.exports = router