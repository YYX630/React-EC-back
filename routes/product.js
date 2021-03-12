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
  list,
  productsCount,
  productStar,
} = require("../controllers/product");

// 指定urlに対し、実行したい関数を順番に突っ込む。一応、middleware, controllerとの区別はできるが、ぶっちゃけただの関数。
// route
//注意：　URL内の”：”は、expressではルートパラメータと呼ばれ、置き換えられる。

//CRUD
router.post("/product", authCheck, adminCheck, create); //作成
router.put("/product/:slug", authCheck, adminCheck, update); //更新
router.delete("/product/:slug", authCheck, adminCheck, remove); //削除
router.get("/product/:slug", read); //一つの情報の読み取り
router.get("/products/:count", listAll); //複数個の読み取り。何個読み取るか上限を渡す
router.post("/products", list); //条件に従った抽出
router.get("/countproducts", productsCount); //総数を調べる。注意、urlを"product/total"とかにすると、listAllの上に置かないと、url判定で混ざってバグる

// rating
router.put("/product/star/:productId", authCheck, productStar);

//export
module.exports = router;
