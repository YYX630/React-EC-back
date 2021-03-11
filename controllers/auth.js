//routesフォルダ内のauthRouteのための本命処理の関数。(controller)

const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  //to decide whether we have to update or create a new user.

  const { name, picture, email } = req.user; //middleware auth.jsのおかげですでに存在するデータ
  const user = await User.findOneAndUpdate(
    { email: email },
    { name: email.split("@")[0], picture: picture },
    { new: true }
  ); //第一引数に従ってDBからuserを探し、第二引数でupdateする。

  if (user) {
    // 見つかって、update成功したら
    console.log("Server: User Updated");
    res.json(user);
  } else {
    // 既存のには見つからなかったら
    const newUser = await new User({
      email: email,
      name: email.split("@")[0],
      picture: picture,
    }).save();
    console.log("Server: New User Created");
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  // 自分のDBから検索する
  User.findOne({ email: req.user.email }).exec((err, user) => {
    //mongooseモデルのメソッド(findOne)の返り値を前から順に、err,userと名付けている。
    if (err) throw new Error(err);
    res.json(user);
  });
};
