// user のschemaを書く。reqのうち、なにをdatabaseに記録するか指定する。

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true, //必須かどうか。必須なのに含まれてなかったら、データベースに追加されない。
      index: true, //キーだということ。
    },
    role: {
      type: String,
      default: "subscriber",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: String,
    // wishlist: [{type: ObjectId, ref = "Product"}], //product modelを参照するよという設定。
  },
  { timestamps: true } //第二引数のオブジェクト。何かの設定かな。
);

module.exports = mongoose.model("User", userSchema); //大文字で、modelの目印に。
