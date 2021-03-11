const Sub = require("../models/sub");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    // まずはfrontから情報を受け取る。
    const { name, parent } = req.body;
    const sub = await new Sub({
      name: name,
      slug: slugify(name),
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
  let sub = await (await Sub.findOne({ slug: req.params.slug })).execPopulate(); //req.params.slugはrouteでapi/sub/:slugを書いてるから使える
  res.json(sub);
};

exports.update = async (req, res) => {
  const { name, parent } = req.body; //HP ->Hewilt Paceed に変更することを考える
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, slug: slugify(name), parent: parent }
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
