
const { ProdModel } = require('../models.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');

async function ImportProduct() {

  await mongoose.connect('mongodb://localhost:27017/sdc')

  const prodParser = fs.createReadStream('./csv_files/product.csv').pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );

  let count = 0;

  for await (const product of prodParser) {
    count++

    meta = {
      _id: product.id,
      name: product.name,
      slogan: product.slogan,
      description: product.description,
      category: product.category,
      default_price: product.default_price,
    }

    if(count === 100000) {
      count = 0;
      console.log("100k uploaded")
    }

    await ProdModel.create(meta)
    // console.log(meta)
  }

  console.log('finished product')
}

// ImportProduct();


