//删掉profile和google

const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login",(req,res)=> {
    res.render("login",{user:req.user});
});

//signup
router.get("/signup", (req, res) => {
    res.render("signup", { user: req.user });
  });


//logout
router.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/");
});

//local login
router.post("/login",passport.authenticate("local",{
    failureRedirect:"/auth/login",
    failureFlash:"Wrong email or password.",
}),(req,res)=>{
  console.log("log in success");
  res.redirect("/chatroom");
}
);

//signup
router.post("/signup", async (req, res) => {
    console.log(req.body);
    let { name, email, password } = req.body;
    //check if the data is already in db
    const nameExist = await User.findOne({ name });
    if (nameExist) {
      req.flash("error_msg", "Ops, this name has already been registered.");
      res.redirect("/auth/signup");
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      req.flash("error_msg", "Ops, this email has already been registered.");
      res.redirect("/auth/signup");
    }
  
    const hash = await bcrypt.hash(password, 10);
    password = hash;
    let newUser = new User({ name, email, password });
    try {
      await newUser.save();
      req.flash("success_msg", "Registration succeeds. You can login now.");
      res.redirect("/auth/login");
    } catch (err) {
      req.flash("error_msg", err.errors.name.properties.message);
      res.redirect("/auth/signup");
    }
  });

//google authertication
router.get("/google",passport.authenticate("google",{
    scope:["profile","email"],
})
);
//google redirect
router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{
    res.redirect("/chatroom");
})

module.exports = router;