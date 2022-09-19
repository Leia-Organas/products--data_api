const mongoose = require('mongoose');
require('mongoose-type-url');

mongoose.connect('mongodb://localhost/sdc');

let photoSchema = mongoose.Schema({

  _id: mongoose.ObjectId(),
  id: Number,
  styleId: Number,
  url: {
    work: mongoose.SchemaTypes.Url,
    profile: mongoose.SchemaTypes.Url
  },
  thumbnail_url: {
    work: mongoose.SchemaTypes.Url,
    profile: mongoose.SchemaTypes.Url
  }
});

let skuSchema = mongoose.Schema({

  _id: mongoose.ObjectId(),
  id: Number,
  styleId: Number,
  size: String,
  quantity: Number
});

let styleSchema = mongoose.Schema({

  _id: mongoose.ObjectId(),
  id: Number,
  productId: Number,
  name: String,
  sale_price: Number,
  original_price: Number,
  default_style: Boolean,
  photos: Array,
  skus: Array
});

let featureSchema = mongoose.Schema({

  _id: mongoose.ObjectId(),
  id: Number,
  productId: Number,
    feature: String,
    Value: String
});

let productSchema = mongoose.Schema({

  _id: mongoose.ObjectId(),
  id: Number,
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: Number,
    features: Array,
    styles: Array,
    related: Array
});

const PhotoModel = mongoose.model('PhotoModel', photoSchema);
const SkuModel = mongoose.model('SkuModel', skuSchema);
const StyleModel = mongoose.model('StyleModel', styleSchema);
const FeatureModel = mongoose.model('FeatureModel', featureSchema);
const ProductModel = mongoose.model('ProductModel', productSchema);

module.exports = {
  PhotoModel,
  SkuModel,
  FeatureModel,
  ProductModel
}

