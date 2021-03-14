const express = require("express"); //import express => express.routerがが使えるようになる

const router = express.Router();

// import middleware methods
const { authCheck, adminCheck } = require("../middlewares/auth");

// import controller methods
const {
  create,
  read,
  readWithProducts,
  update,
  remove,
  list,
} = require("../controllers/sub");

// 指定urlに対し、実行したい関数を順番に突っ込む。一応、middleware, controllerとの区別はできるが、ぶっちゃけただの関数。
// route

//注意：　URL内の”：”は、expressではルートパラメータと呼ばれ、置き換えられる。
router.post("/sub", authCheck, adminCheck, create);
router.get("/subs", list); //これは公開
router.get("/sub/:slug", read); //readにはslug情報をfrontから送る必要がある。urlに含めることで、req.params.slugの形で入る。
router.get("/sub-with-products/:slug", readWithProducts);
router.put("/sub/:slug", authCheck, adminCheck, update);
router.delete("/sub/:slug", authCheck, adminCheck, remove);

//export
module.exports = router;
