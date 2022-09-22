const { StyleModel,PhotoModel } = require('../models.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');

let objOfPhotos = {};

async function ImportPhotos() {

  await mongoose.connect('mongodb://localhost:27017/sdc')

  const photosParser = fs.createReadStream('./csv_files/photos.csv').pipe(
    parse({
      skip_records_with_error: true,
      columns: true
    })
  );
  let arrayOfPhotos = [];
  let currStyle = 1;
  let count = 0;

  for await(const photos of photosParser) {
    count++

    if(currStyle === Number(photos.styleId)) {
      arrayOfPhotos.push(
        {
          thumbnail_url: photos.thumbnail_url,
          url: photos.url
        }
      )
    } else {
      let meta = {
        styleId: currStyle,
        photos: arrayOfPhotos
      }

      // console.log(meta);
      await PhotoModel.create(meta);
      arrayOfPhotos = [];
      currStyle = Number(photos.styleId);
      arrayOfPhotos.push(
        {
          thumbnail_url: photos.thumbnail_url,
          url: photos.url
        }
      )
    }

    if(count === 100000) {
      count = 0;
      console.log("100k uploaded")
    }

    // if(count > 15) {
    //   break;
    // }
  }

  console.log('finished photos')
}

// ImportPhotos();


async function aggregatePhotos() {

  await mongoose.connect('mongodb://localhost:27017/sdc')

const photosParser = fs.createReadStream('./csv_files/photos.csv').pipe(
  parse({
    skip_records_with_error: true,
    columns: true
  })
);

let count = 0;

for await(const photos of photosParser) {
  count++


      photo = {
        thumbnail_url: photos.thumbnail_url,
        url: photos.url
      }


      await StyleModel.updateOne({style_id: photos.styleId}, {$push: {photos: photo}})


  if(count === 100000) {
    count = 0;
    console.log("100k uploaded")
  }

  // if(count > 15) {
  //   break;
  // }
}

console.log('finished photos')
}

// aggregatePhotos()
//takes too long