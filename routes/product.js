const express = require("express"); //import express => express.routerがが使えるようになる

const router = express.Router();

// import middleware methods
const { authCheck, adminCheck } = require("../middlewares/auth");

// import controller methods
const {
  create,
  read,
  update,
  remove,
  listAll,
} = require("../controllers/product");

// 指定urlに対し、実行したい関数を順番に突っ込む。一応、middleware, controllerとの区別はできるが、ぶっちゃけただの関数。
// route
//注意：　URL内の”：”は、expressではルートパラメータと呼ばれ、置き換えられる。
router.post("/product", authCheck, adminCheck, create);
//すべてを一度に読むことにすると負荷が大きすぎる→少しずつにする
router.get("/products/:count", listAll);
router.get("/product/:slug", read);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);

//export
module.exports = router;
