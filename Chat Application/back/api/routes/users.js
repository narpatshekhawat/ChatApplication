const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");
const jwtHelper = require("../config/jwtHelper");

router.get("/" , UsersController.t);
router.post("/register", UsersController.create_user);
router.post("/login", UsersController.get_user);
router.post("/authenticate", UsersController.authenticate);
router.get("/userProfile" , jwtHelper.verifyJwtToken , UsersController.userProfile)

module.exports = router;