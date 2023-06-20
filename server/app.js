const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = 1000;



//------------------------------------------------------

//password : krutik..12345
const {MONGOURI} =  require("./keys")


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


mongoose.connection.on('connected',()=>{
    console.log("Connected to mongoose");
})
mongoose.connection.on('error',(err)=>{
    console.log("Error",err);
})

//-------------------------------------------------------

require("./models/user")
require("./models/post")

app.use(express.json())//auth na path pella lakhwaa nu
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))



//----------------------------------------------------------

app.listen(PORT,()=>{
    console.log("server is running ON",PORT);
})


