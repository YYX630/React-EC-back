const Product = require("../models/product");
const User = require("../models/user");
// const slugify = require("slugify");
// const slug = require("limax");

const Kuroshiro = require("kuroshiro");
const kuroshiro = new Kuroshiro();
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
kuroshiro.init(new KuromojiAnalyzer());
exports.create = async (req, res) => {
  try {
    // console.log("REQ BODY", req.body);
    req.body.slug = await kuroshiro.convert(req.body.title, {
      to: "romaji",
      romajiSystem: "passport",
    }); //req.bodyにslugを追加
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
  const limit = req.params.count;
  const products = await Product.find({}) //すべて取得
    .limit(parseInt(limit)) //何個取得するかreqで指定する
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
      req.body.slug = await kuroshiro.convert(req.body.title, {
        to: "romaji",
        romajiSystem: "passport",
      }); //名前変えた場合、slugも変えてあげる
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

//WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     //new arrivals や best sellers両方に対応できるよう、オプション多めに渡される。
//     // createdAt/updated at, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .sort({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

//WITH PAGINATION
exports.list = async (req, res) => {
  try {
    //new arrivals や best sellers両方に対応できるよう、オプション多めに渡される。
    // createdAt/updated at, desc/asc, 3
    const { sort, order, limit, page } = req.body;
    const currentPage = page || 1;
    const perPage = limit;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .sort({})
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  //製品を捜索
  const product = await Product.findById(req.params.productId).exec();
  // userを検索
  const user = await User.findOne({ email: req.user.email }).exec();

  //評価をする。
  const { star } = req.body;
  // check if currently logged in user have already added rating to this product

  //引っ張ってきた製品の中から検索！Productじゃなくてproductね。
  console.log("product", product);

  let existingRatingObject = product.ratings.find((element) => {
    return element.postedBy.toString() === user._id.toString(); //toSting()使わずに、==で比較でもいいけど。  //return忘れてた製でバグってたーーーー
  });

  // if user haven't left rating yet, push it as a new one
  // if user already has one, update it.
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true } //be able to send the newly updated object also to the frontend.
    )
      .exec()
      .then((result) => {})
      .catch((err) => console.log(err));
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject }, //他の製品で、ratingsだけが同じなものはmatchしないような仕様なのかな。existingRatingObjectの中身によるか。
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    )
      .exec()
      .then((result) => {})
      .catch((err) => console.log(err));
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id }, //本体を除外した上で、
    category: product.category, //本体と同じカテゴリーのものを表示
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.json(related);
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("populatedBy", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  //いろいろな検索方法を実装。
  const { query } = req.body;
  if (query) {
    console.log("query", query);
    await handleQuery(req, res, query); //関数をほかのところに分割。
  }
};
