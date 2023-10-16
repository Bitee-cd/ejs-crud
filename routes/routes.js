const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");

//image upload
var storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

//Add an user
router.post("/add", upload, async (req, res) => {
  try {
    const user = User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });
    if (user) {
      req.session.message = {
        type: "success",
        message: "User added successfully",
      };
      res.redirect("/");
    }
  } catch (error) {
    res.json({ message: error.message, type: "danger" });
  }
});
//Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);

    res.render("index", { title: "Home Page", users: users });
  } catch (err) {
    res.json({ message: error.message, type: "danger" });
  }
});
router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

//Edit an user
router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id);
    console.log(user);
    if (user) {
      res.render("edit_users", { user: user, title: "Edit User" });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/");
  }
});

//update user route
router.post("/update/:id", upload, async (req, res) => {
  try {
    let id = req.params.id;
    let new_img = " ";

    if (req.file) {
      new_img = req.file.filename;
      try {
        fs.unlinkSync("./public/uploads/" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_img = req.body.old_image;
    }
    const user = await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_img,
    });
    req.session.message = {
      type: "success",
      message: "User updated successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

//Delete user route
router.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndRemove(id);
    if (deletedUser && deletedUser.image != null) {
      try {
        fs.unlinkSync("./public/uploads/" + deletedUser.old_image);
      } catch (er) {
        console.log(er);
      }
      req.session.message = {
        type: "success",
        message: "User deleted successfully",
      };
      res.redirect("/");
    }
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

router.get("/about", async (req, res) => {
  try {
    res.render("about", { title: "About" });
  } catch {}
});
module.exports = router;
