const Campground=require("../Models/campground.js");
const Review=require("../Models/reviews.js");

module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "You created a review!");
    res.redirect(`/campgrounds/${id}`);
  
}

module.exports.deleteReview=async(req,res)=>{
    const {id, reviewId}=req.params;
    await Campground.findByIdAndUpdate(id, { $pull:{reviews:reviewId}});
    await Review.findOneAndDelete(reviewId);
    req.flash("success", "You deleted the review!");
    res.redirect(`/campgrounds/${id}`);
}