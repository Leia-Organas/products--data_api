const { FeatureModel } = require('../models.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');

async function ImportFeature() {

  await mongoose.connect('mongodb://localhost:27017/sdc')

  const featureParser = fs.createReadStream('./csv_files/features.csv').pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );

  let arrayOfFeatures = [];
  let currProd = 1;
  let count = 0;

  for await (const feature of featureParser) {
    count++

    if (currProd === Number(feature.product_id)) {
      arrayOfFeatures.push(
        {
          feature: feature.feature,
          value: feature.value
        }
      )
    } else {
      let meta = {
        product_id: currProd,
        features: arrayOfFeatures
      }
      // console.log(meta)
      await FeatureModel.create(meta)
      arrayOfFeatures = [];
      currProd = Number(feature.product_id);
      arrayOfFeatures.push(
        {
          feature: feature.feature,
          value: feature.value
        }
      )

      if(count === 100000) {
        count = 0;
        console.log("100k uploaded")
      }

      // if(count > 15) {
      //   break;
      // }

    }
  }
  console.log('finished feature')
}

// ImportFeature();