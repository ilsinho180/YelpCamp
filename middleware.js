const Campground=require("./Models/campground.js");
const {campgroundSchema, reviewSchema}=require("./schemas.js");
const expressError=require("./Models/Utils/expressError.js");
const Review=require("./Models/reviews.js");

const validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        throw new expressError(msg, 400);
    }
    else{
        next();
    }
};


const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        throw new expressError(msg, 400);
    }
    else{
        next();
    }

};



const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error" ,"You have to be signed in first!");
        return res.redirect("/login");
    }
    next();
};

const isAuthor= async (req,res,next)=>{
    const { id } = req.params;
    const camp=await Campground.findById(id);
    if (!camp.author.str===req.user._id) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};


const isReviewAuthor=async (req,res,next)=>{
    const { id, reviewId } = req.params;
    const rev=await Review.findById(reviewId);
    if (!rev.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};


module.exports={isLoggedIn, isAuthor, validateCampground, validateReview, isReviewAuthor};