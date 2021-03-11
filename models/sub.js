const mongoose = require("mongoose");

const subSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //空白除去
      required: "Name is required", //なかった時の警告メッセージ＝not0 = true //
      minlength: [2, "Too Short"],
      maxlength: [64, "Too long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sub", subSchema);
