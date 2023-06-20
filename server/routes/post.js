const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const requirelogin = require("../middleware/requirelogin")
const Post = mongoose.model("Post")

//to show all the post
router.get("/allpost",requirelogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    //posted by ma user ni badhi property show krvaa maate
    .sort("-createdAt")
    .then(posts =>{
        res.json({posts})
    })
    .catch(err =>{
        console.log(err);
    })
})


router.get("/getsubpost",requirelogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    //posted by ma user ni badhi property show krvaa maate
    .sort("-createdAt")
    .then(posts =>{
        res.json({posts})
    })
    .catch(err =>{
        console.log(err);
    })
})


router.post("/createpost",requirelogin,(req,res)=>{
    const{title,body,pic} = req.body 
    if(!title ||!body || !pic){
        return res.status(422).json({error:"Please Add All The Field"})
    }

    req.user.password = undefined//post ma password pass naikrvaa no hoi

    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err =>{
        console.log(err)
    })
})


router.get("/mypost",requirelogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost =>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err);
    })
})


//update krvaa nu 6 so...PUT request ....
router.put("/like",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
        //middle ware ma userdata ==== req.user ma store krela che

    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
        
    })
})


router.put("/unlike",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
        //middle ware ma userdata ==== req.user ma store krela che

    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
        
    })
})


router.put("/comment",requirelogin,(req,res)=>{
    const comment ={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
        //middle ware ma userdata ==== req.user ma store krela che

    },{
        new:true

    })
    //baar user id name moklvaaa
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
        
    })
})


router.delete('/deletepost/:postId',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})

router.delete('/deletecomment/:postId/:commentId',requirelogin,(req,res)=>{
    Post.findById(req.params.postId)
    .populate("comments.postedBy","_id name")
      .exec((err,post)=>{
          if(err || !post){
            return res.status(422).json({message:"Some error occured!!"});
          }
          const comment = post.comments.find((comment)=>
            comment._id.toString() === req.params.commentId.toString()
            );
            // if (comment.postedBy._id.toString() === req.user._id.toString()) {
                const removeIndex = post.comments
                .map(comment => comment._id.toString())
                .indexOf(req.params.commentId);
                post.comments.splice(removeIndex, 1);
                post.save()
                .then(result=>{
                    res.json(result)
                }).catch(err=>console.log(err));
            // }
      })
})






// Adminnnnnnn

router.delete('/deleteadminpost/:postId',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
      
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        
    })
})


router.delete('/deleteadmincomment/:postId/:commentId',requirelogin,(req,res)=>{
    Post.findById(req.params.postId)
    .populate("comments.postedBy","_id name")
      .exec((err,post)=>{
          if(err || !post){
            return res.status(422).json({message:"Some error occured!!"});
          }
          const comment = post.comments.find((comment)=>
            comment._id.toString() === req.params.commentId.toString()
            );
            // if (comment.postedBy._id.toString() === req.user._id.toString()) {
                const removeIndex = post.comments
                .map(comment => comment._id.toString())
                .indexOf(req.params.commentId);
                post.comments.splice(removeIndex, 1);
                post.save()
                .then(result=>{
                    res.json(result)
                }).catch(err=>console.log(err));
            // }
      })
})








module.exports = router



