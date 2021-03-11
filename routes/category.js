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
  list,
  getSubs,
} = require("../controllers/category");

// 指定urlに対し、実行したい関数を順番に突っ込む。一応、middleware, controllerとの区別はできるが、ぶっちゃけただの関数。
// route

//注意：　URL内の”：”は、expressではルートパラメータと呼ばれ、置き換えられる。
router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list); //これは公開
router.get("/category/:slug", read); //readにはslug情報をfrontから送る必要がある。urlに含めることで、req.params.slugの形で入る。
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);

//subcategoryの取得
router.get("/category/subs/:_id", getSubs); //:id = parentのid

//export
module.exports = router;
