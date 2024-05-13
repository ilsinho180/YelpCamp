const Campground = require("../Models/campground.js");
const { cloudinary } = require("../Cloudinary/index.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate('author');
    if (!campground) {
        req.flash("error", "This campground doesn't exist!");
        return res.redirect("/campgrounds");
    }
    const reviews = campground.reviews;
    res.render("campgrounds/show.ejs", { campground, reviews });
}

module.exports.createCampground = async (req, res, next) => {
    const geo=await geocoder.forwardGeocode({
        query:req.body.campground.location
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry=geo.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "You created another campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "This campground doesn't exist!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit.ejs", { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash("success", "You updated the campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    console.log(campground);
    req.flash("success", "You deleted the campground!");
    res.redirect("/campgrounds");
}