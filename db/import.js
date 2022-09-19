
const mongoose = require('mongoose');
require('mongoose-type-url');
// const {PhotoModel} = require('./model.js');
// ERROR IS CAUSED BY MODEL
const fs = require('fs');
const {parse} = require('csv-parse');

async function Import() {

  // await mongoose.connect('mongodb://localhost/sdc',
  // {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useFindAndModify: false
  // });

  let count = 0

  const metaParser = fs.createReadStream('./db/photos.csv').pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );


  for await ( const record of metaParser) {
      count++

      let meta = {
        id: record.id,
        styleId: record.styleId,
        url: record.url,
        thumbnail_url: record.thumbnail_url,
          }

      // await PhotoModel.create(meta)
          if(count < 10) {
            console.log(meta)
          } else {
            break;
          }


  }
  console.log('finished')

}

Import();