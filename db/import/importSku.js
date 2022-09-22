const { SkuModel } = require('../models.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');

let objOfPhotos = {};

async function ImportSkus() {

  await mongoose.connect('mongodb://localhost:27017/sdc')

  const skuParser = fs.createReadStream('./csv_files/skus.csv')
  .pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );
  let objectOfSkus = {};
  let currStyle = 1;
  let count = 0;

  for await(const sku of skuParser) {
    count++

    if(currStyle === Number(sku.styleId)) {
      objectOfSkus[sku.id] = {
        quantity: Number(sku.quantity),
        size: sku.size
      }
    } else {
      let meta = {
        styleId: currStyle,
        skus: objectOfSkus
      }

      // console.log(meta);
      await SkuModel.create(meta);
      objectOfSkus = {};
      currStyle = Number(sku.styleId);
      objectOfSkus[sku.id] = {
        quantity: Number(sku.quantity),
        size: sku.size
      }
    }

    if(count === 100000) {
      count = 0;
      console.log("100k iterated")
    }

    // if(count > 15) {
    //   break;
    // }
  }

  console.log('finished skus')
}

ImportSkus();
