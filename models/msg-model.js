const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema ({
    name: {
        type: String,
        required:true,
        minLength:6,
        maxlength:255,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    content: {
        typr:String,
        required:true,
    },
    author:String,
});

modile.exports = mongoose