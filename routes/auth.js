const express = require("express"); //import express => express.routerがが使えるようになる

const router = express.Router();

// import middleware methods
const { authCheck, adminCheck } = require("../middlewares/auth");

// import controller methods
const { createOrUpdateUser, currentUser } = require("../controllers/auth");
//exports defaultsじゃないexportなので、ブレイクしないとどの関数のことかわからない。

// 指定urlに対し、実行したい関数を順番に突っ込む。一応、middleware, controllerとの区別はできるが、ぶっちゃけただの関数。
router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

//export
module.exports = router;
