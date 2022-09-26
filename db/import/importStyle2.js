const { Style2Model, SkuModel, PhotoModel } = require('../models.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');

async function ImportStyle2() {

  await mongoose.connect('mongodb://localhost:27017/sdc')

  const styleParser = fs.createReadStream('./csv_files/styles.csv')
  .pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );

  let count = 0;

  for await (const style of styleParser) {
    count++

    // let photosId = await PhotoModel.findOne({styleId: style.id},'_id')
    // let skusId = await SkuModel.findOne({styleId: style.id},'_id')

    meta = {
      product_id: style.productId,
    style_id: Number(style.id),
    name: style.name,
    original_price: style.original_price,
    sale_price: style.sale_price === "null" ? "0" : style.sale_price,
    "default?": style.default_style === "1" ? true : false,
    // photos: photosId,
    // skus: skusId
    }


    if (count === 100000) {
      count = 0;
      console.log("100k uploaded")
    }

    await Style2Model.create(meta)
    // console.log(meta)

    // if(count > 5){
    //   break;
    // }
  }

  console.log('finished style2')
}

// ImportStyle2();
//took too long

async function addPhotos  () {
  await mongoose.connect('mongodb://localhost:27017/sdc')

  count = 0;
  for (let i = 1; i <= 1958102; i++){
    let photosId = await PhotoModel.findOne({styleId: i},'_id')

    await Style2Model.updateOne({style_id: i},{photos: photosId})
    count++
    if(count=== 100000){
      count = 0;
      console.log('iterated 100000')
    }
  }

}

// addPhotos()
//took too long
