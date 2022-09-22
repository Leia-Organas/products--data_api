const mongoose = require('mongoose');

// GET /products
// GET /products/:product_id
let prodSchema = mongoose.Schema({
  _id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
});

let featureSchema = mongoose.Schema({
  product_id: Number,
  features: Array
})

//lGET /products/:product_id/related
let relatedSchema = mongoose.Schema({
  product_id: Number,
  related: Array
})

// GET /products/:product_id/styles
let styleSchema = mongoose.Schema(
  {
    product_id: String,
    style_id: Number,
    name: String,
    original_price: String,
    sale_price: String,
    "default?": Boolean,
    photos:[],
    skus: {}
  }
)

let photoSchema = mongoose.Schema({
  styleId: Number,
  photos: Array
})

let skuSchema = mongoose.Schema({
  styleId: Number,
  skus: Object
})

const ProdModel = mongoose.model('ProdModel', prodSchema);
const FeatureModel = mongoose.model('FeatureModel', featureSchema);
const RelModel = mongoose.model('RelModel', relatedSchema);
const StyleModel = mongoose.model('StyleModel', styleSchema);
const PhotoModel = mongoose.model('PhotoModel', photoSchema);
const SkuModel = mongoose.model('SkuModel', skuSchema);

module.exports = {
  ProdModel,
  FeatureModel,
  RelModel,
  StyleModel,
  PhotoModel,
  SkuModel
}