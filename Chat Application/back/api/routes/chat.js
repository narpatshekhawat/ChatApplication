const express = require("express");
const router = express.Router();
const ChatsController = require("../controllers/chat");

router.post("/" , ChatsController.save_chat);

router.get("/:room" , ChatsController.get_chat);

router.post("/image", ChatsController.save_image);

router.put("/likes",ChatsController.save_like);

module.exports = router;