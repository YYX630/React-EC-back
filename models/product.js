const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
      maxlength: [32, "Too long"],
      test: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [2000, "Too long"],
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: [
      //This is an array of many subs
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["大仏", "仏", "鬼", "大鬼"], //enumにしたことで、これ以外の選択を受け付けないようにした。色の追加はここから。
    },
    brand: {
      //DBをハックされて変なブランドを追加されないように、予防。
      type: String,
      enum: ["B1", "B2", "B3", "B4", "M1", "M2"],
    },
    // ratings: [
    //   //{star,postedBy}がたくさんある配列
    //   {
    //     star: {
    //       type: Number,
    //     },
    //     postedBy: {
    //       type: ObjectId,
    //       ref: "User",
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
