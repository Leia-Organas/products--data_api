const { StyleModel, SkuModel, PhotoModel } = require('../models.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');

async function ImportStyle() {

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

    meta = {
      product_id: style.productId,
    style_id: Number(style.id),
    name: style.name,
    original_price: style.original_price,
    sale_price: style.sale_price === "null" ? "0" : style.sale_price,
    "default?": style.default_style === "1" ? true : false
    }


    if (count === 100000) {
      count = 0;
      console.log("100k uploaded")
    }

    await StyleModel.create(meta)
    // console.log(meta)

    // if(count > 5){
    //   break;
    // }
  }

  // console.log('finished style')
}

// ImportStyle();

async function addPhotos() {
  await mongoose.connect('mongodb://localhost:27017/sdc')

  const styleParser = fs.createReadStream('./csv_files/styles.csv')
  .pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );
    count = 0;
  for await (const style of styleParser) {
    let photos = await PhotoModel.findOne({styleId: Number(style.id)})

      let styles = await StyleModel.findOneAndUpdate({style_id: Number(style.id)}, {'photos': photos? photos.photos : []})



    count++

    if (count === 100000) {
      count = 0;
      console.log("100k iterated")
    }
  }

}

// addPhotos()
// killed - took too long

async function addPhotosAndSkus  () {
  await mongoose.connect('mongodb://localhost:27017/sdc')


     count = 0;

      for await (const doc of StyleModel.find()) {
        let photos = await PhotoModel.findOne({styleId: doc.style_id})
        let skus = await SkuModel.findOne({styleId: doc.style_id})
        doc.photos = photos ? photos.photos : [];
        doc.skus = skus ? skus.skus : {};
        await doc.save();
        // console.log(doc)
        count++
        if(count === 1){
          console.log('began')
        }
        if (count === 100000) {
          count = 0;
          console.log("100k iterated")
        }

      }

      console.log('added photos and skus')
}

// addPhotosAndSkus()
//took too long
