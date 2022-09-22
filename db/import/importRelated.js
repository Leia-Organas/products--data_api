
const { RelModel } = require('../models.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');

async function ImportRelated() {

  await mongoose.connect('mongodb://localhost:27017/sdc')

  const relatedParser = fs.createReadStream('./csv_files/related.csv')
  .pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );

  let arrayOfIds = [];
  let currProd = 1;
  let count = 0;

  for await (const related of relatedParser) {
    count++

    if(currProd === Number(related.current_product_id)) {
      arrayOfIds.push(Number(related.related_product_id))

    } else {
      let meta = {
        product_id: currProd ,
        related: arrayOfIds
      }

      await RelModel.create(meta)
      arrayOfIds = [];
      currProd = Number(related.current_product_id);
      arrayOfIds.push(Number(related.related_product_id))
    }

      if(count === 100000) {
        count = 0;
        console.log("100k uploaded")
      }

      // if(count > 10) {
      //   break;
      // }


  }

  console.log('finished related')
}

// ImportRelated();
