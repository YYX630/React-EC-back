const Category = require("../models/category");
const Sub = require("../models/sub");
const Product = require("../models/product");

// const slugify = require("slugify");
// const slug = require("limax");
const Kuroshiro = require("kuroshiro");
const kuroshiro = new Kuroshiro();
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
kuroshiro.init(new KuromojiAnalyzer());

exports.create = async (req, res) => {
  try {
    // まずはfrontから情報を受け取る。
    const { name } = req.body;
    const category = await new Category({
      name: name,
      slug: await kuroshiro.convert(name, {
        to: "romaji",
        romajiSystem: "passport",
      }),
    }).save(); //save()でデータベースに保存。
    res.json(category); //関係ないけど、resに含めとく。
  } catch (err) {
    console.log(err);
    res.status(400).send("Category create failed");
  }
};

exports.list = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec(); //すべて取得
  res.json(categories); //resに追加
};

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec(); //req.params.slugはrouteでapi/category/:slugを書いてるから使える
  res.json(category);
};

exports.readWithProducts = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec(); //req.params.slugはrouteでapi/category/:slugを書いてるから使える
  // res.json(category);
  let products = await Product.find({ category: category._id })
    .populate("category")
    .exec();
  console.log("PRODUCTS", products);
  res.json({ category, products }); //jsonに渡すのは一つの（！）オブジェクト
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      //findByIdAndRemoveもあるよ
      { slug: req.params.slug },
      {
        name: name,
        slug: await kuroshiro.convert(name, {
          to: "romaji",
          romajiSystem: "passport",
        }),
      }
    ); //nameはすでにreq.bodyから取得したもの。検索は、url内の既存のslugで。つまり、api/category/apple に、req.body={"name": "newname"}て感じ
    res.json(updated);
  } catch (err) {
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Category delete failed");
  }
};

exports.getSubs = async (req, res) => {
  return await Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err);
    res.json(subs);
  });
  //get なので、errメッセージ不要
};
