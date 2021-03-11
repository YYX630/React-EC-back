const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log("REQ BODY", req.body);
    req.body.slug = slugify(req.body.title); //req.bodyにslugを追加
    const newProduct = await new Product(req.body).save(); //情報はすべてreq.bodyにオブジェクトとしてある。それをsave()でDBに保存するだけ。
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Product create failed");
    //res.json({ err: err.message }); //これでは、内容は充実したが、失敗時も、ただのresponseに取られてエラー判定されない。

    //したがって、以下がいい
    res.status(400).json({ err: err.message }); //keyのerrは文字列、値のerrは変数
  }
};

exports.listAll = async (req, res) => {
  const products = await Product.find({}) //すべて取得
    .limit(parseInt(req.params.count)) //何個取得するかreqで指定する
    .populate("category") //categoryの取得
    .populate("subs") //subcategoryの取得
    .sort([["createdAt", "desc"]]) //createAtフィールドの値で、降順に並べるということ
    .exec(); //???
  res.json(products); //resに追加
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();
  res.json(product);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    return res.status(400).send("Product delete failed");
  }
};

exports.update = async (req, res) => {
  try {
    //注意、updateするとslugも自動で変えたい
    if (req.body.title) {
      req.body.slug = slugify(req.body.title); //名前変えた場合、slugも変えてあげる
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec(); //第一引数：検索条件、第二：更新内容、　第三：設定:resに更新前ではなく更新後の情報を使いたい場合は、new:true設定。
    //req.params.slugと、req.body.slugの違いに注意！　paramsはurl中の変数
    return res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERR ====>", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};
