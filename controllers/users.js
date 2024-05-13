const User=require("../Models/user.js");

module.exports.renderRegister=(req,res)=>{
    res.render("./users/register.ejs")
}

module.exports.register=async (req,res)=>{
    try{
        const {email, username, password}=req.body;
        const user=new User({email, username});
        const registredUser=await User.register(user, password);
        req.login(registredUser, (e)=>{
            if(e){
                return next(e);
            }
            else{
                req.flash("success", "Successfully registred!");
                res.redirect("/campgrounds");
                console.log(registredUser);
            }
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.login=(req,res)=>{
    const URL= req.session.returnTo;
    // console.log(URL);
    delete req.session.returnTo;
    req.flash("success", "Welcome back!");
    res.redirect(URL);
}

module.exports.logout=(req,res)=>{
    req.logout(()=>{
      req.flash("success", "Successfully logged you out!");
      return res.redirect("/campgrounds");
    })
  
  }
