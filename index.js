const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//google authertication
const authRoute = require("./routes/auth-route");
const res = require("express/lib/response");
require("./config/passport");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
//connect to MongoDB
mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
).then(() => {
console.log("Connect to MongoDB Atlas");
})
.catch((err) => {
console.log(err);
});


//middlewares
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    //local passport autheticate error
    res.locals.error = req.flash("error");
    next();
  });
//Any req will pass by middlewares, if there exists /auth, they will enter authRoute
//And excute authRoute
app.use("/auth",authRoute);


// Homepage 
app.get("/",(req,res) => {
  res.render("index.ejs",{user:req.user});
});


//Chatroom
app.get("/chatroom", (req, res) => {
  console.log(req.user);
  res.render("chatroom.ejs",{user:req.user});
});


io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

//Listen

http.listen(8080, () => {
  console.log(`Socket.IO server running`);
});
