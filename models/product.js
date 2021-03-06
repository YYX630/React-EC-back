const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
      maxlength: [32, "Too long"],
      text: true,
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
      enum: ["Yes", "No", ""],
    },
    color: {
      type: String,
    },
    brand: {
      type: String,
    },
    ratings: [
      //{star,postedBy}がたくさんある配列
      {
        star: {
          type: Number,
        },
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
