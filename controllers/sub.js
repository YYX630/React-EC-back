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
    const { name, parent } = req.body;
    const sub = await new Sub({
      name: name,
      slug: await kuroshiro.convert(name, {
        to: "romaji",
        romajiSystem: "passport",
      }),
      parent: parent,
    }).save(); //save()でデータベースに保存。
    res.json(sub); //関係ないけど、resに含めとく。
  } catch (err) {
    console.log(err);
    res.status(400).send("Sub create failed");
  }
};

exports.list = async (req, res) => {
  const categories = await Sub.find({}).sort({ createdAt: -1 }).exec(); //すべて取得
  res.json(categories); //resに追加
};

exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec(); //req.params.slugはrouteでapi/sub/:slugを書いてるから使える
  res.json(sub);
};

exports.readWithProducts = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec(); //req.params.slugはrouteでapi/category/:slugを書いてるから使える
  // res.json(category);
  let products = await Product.find({ subs: sub._id })
    .populate("category")
    .exec();
  // console.log("PRODUCTS", products);
  res.json({ sub, products }); //jsonに渡すのは一つの（！）オブジェクト
};

exports.update = async (req, res) => {
  const { name, parent } = req.body; //HP ->Hewilt Paceed に変更することを考える
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name: name,
        slug: await kuroshiro.convert(name, {
          to: "romaji",
          romajiSystem: "passport",
        }),
        parent: parent,
      }
    ); //nameはすでにreq.bodyから取得したもの。検索は、url内の既存のslugで。つまり、api/sub/apple に、req.body={"name": "newname"}て感じ
    res.json(updated);
  } catch (err) {
    res.status(400).send("Sub update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Sub delete failed");
  }
};
