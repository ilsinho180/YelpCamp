const express = require("express");
const router = express.Router();
const catchAsync = require("../Utils/catchAsync.js");
const { isAuthor, isLoggedIn, validateCampground } = require("../middleware.js");
const campgrounds=require("../controllers/campgrounds.js");
const multer  = require('multer');
const {storage}=require("../Cloudinary/index.js");
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image") , validateCampground, catchAsync(campgrounds.editCampground));


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
router.delete("/:id/delete", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))




module.exports = router;