require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose');
const { ProdModel, FeatureModel, RelModel, StyleModel, PhotoModel, SkuModel } = require('../db/models.js');
const app = express()
const port = process.env.PORT || 3000;



app.use(express.json())

app.get('/products', async (req, res) => {
  let products = await ProdModel.find({}).limit(20);
  return res.status(200).json(products)
})

app.get('/products/:product_id', async (req, res) => {
  let product = await ProdModel.findById(Number(req.params.product_id));
  let features = await FeatureModel.findOne({ product_id: req.params.product_id });
  let body = {
    id: product._id,
    name: product.name,
    slogan: product.slogan,
    description: product.description,
    category: product.category,
    default_price: product.default_price,
    'features': features['features']
  }

  return res.status(200).json(body)
})

app.get('/products/:product_id/related', async (req, res) => {
  let related = await RelModel.findOne({ product_id: req.params.product_id }, 'related');
  let body = related['related']
  console.log(body)
  return res.status(200).json(body)
})

app.get('/products/:product_id/styles', async (req, res) => {
  let results = await StyleModel.aggregate(
    [
      {$match:{
        product_id: req.params.product_id
        }
      },
      { $lookup: {
        from: 'photomodels',
        localField: "style_id",
        foreignField: "styleId",
        as: "photos"
        }
      },
      { $lookup: {
        from: 'skumodels',
        localField: "style_id",
        foreignField: "styleId",
        as: "skus"
        }
      }
    ], 'photos skus')

    styles = results.map(result => {
      result.photos = result.photos[0].photos;
      result.skus = result.skus[0].skus;

      return result;
    })


return res.status(200).json(styles)
})

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/sdc');
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();





