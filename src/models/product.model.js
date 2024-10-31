"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: {
      type: String
    },
    product_price: {
      type: Number,
      required: true
    },
    product_slug: {
      type: String,
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothings", "Furnitures"]
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },
    product_atrributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_ratingsAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// create index for searching
productSchema.index({ product_name: 'text', product_description: 'text' });


// Slugify product name before saving
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    collection: "Clothings",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
};
