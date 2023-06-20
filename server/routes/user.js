const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const requirelogin = require("../middleware/requirelogin")
const Post = mongoose.model("Post")
const User = mongoose.model("User")


router.get("/user/:id",requirelogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User Not Found"})
    })
})


router.put("/follow",requirelogin,(req,res)=>{

    //following
    //jene follow krvaa nu 6 eni idd lidhi
    User.findByIdAndUpdate(req.body.followId,{
        //hve enaa followres ma aapni id add krri
        $push:{followers:req.user._id}
        },{new:true},//navoo record return krse
        (err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}
            },{new:true})
            .select("-password")
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        })
})


router.put("/unfollow",requirelogin,(req,res)=>{

    //following
    //jene follow krvaa nu 6 eni idd lidhi
    User.findByIdAndUpdate(req.body.unfollowId,{
        //hve enaa followres ma aapni id add krri
        $pull:{followers:req.user._id}
        },{new:true},//navoo record return krse
        (err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.unfollowId}
            },{new:true})
            .select("-password")
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        })
})


router.put("/updatepic",requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"pic can't post"})
            }
            res.json(result)
        })
})


router.post("/search-users",(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err);
    })
})


// Admin

router.get("/userlist",requirelogin,(req,res)=>{
    User.find({ _id: { $nin: ["62dec09a58b5c6afaf0409ad"] }})
    .select("_id name email pic")
    
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err);
    })
})


router.delete("/deleteuser/:id",requirelogin,(req,res)=>{
    
    User.findByIdAndDelete({_id:req.params.id})
    // Post.findByIdAndDelete({_id:req.params.id})
    
    
            // .then(result=>{
            //     // user.followers = user.followers.filter((follower) => {
            //     //     return follower.toString() !== req.params.id.toString();
            //     // });
            //     User.deleteFollowers(result._id);

            //     res.json(result)
            // })
            .catch(err=>{
                console.log(err);
            });
        
   
})





module.exports = router