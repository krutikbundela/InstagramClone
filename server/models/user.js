const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/krutikbundela/image/upload/v1658572383/627-6275734_profile-icon-contacts-hd-png-download_nqpakn.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
});

// userSchema.statics.deleteFollowers = function (id) {
//     console.log(User.followers);   
// }

mongoose.model("User",userSchema)