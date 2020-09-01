const fs = require('fs');
const ba64 = require('ba64');
const minio = require('./minioSdk');
const wrapper = require('./wrapper');

const uploadImages = async (bucket, rawImg, objName) => {

  if(!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
  }
  const path = `./uploads/${objName.filename}`;
  let data_url;

  const ext = rawImg.substring('data:image/'.length, rawImg.indexOf(';base64'));

  switch (ext) {
  case 'png':
    data_url = `data:image/png${rawImg}`;
    break;
  case 'jpg':
    data_url = `data:image/jpg${rawImg}`;
    break;
  case 'jpeg':
    data_url = `data:image/jpeg${rawImg}`;
    break;
  case 'gif':
    data_url = `data:image/gif${rawImg}`;
    break;
  }

  ba64.writeImageSync(path, data_url);

  const key = `${objName.folder}/${objName.filename}.${ext}`;
  const images = fs.createReadStream(`./uploads/${objName.filename}.${ext}`);

  const upload = await minio.objectUpload(bucket, key, images.path);

  fs.unlinkSync(`./uploads/${objName.filename}.${ext}`);

  if (upload.err) {
    return wrapper.wrapper_error('err');
  }

  return key;
};

module.exports = {
  uploadImages
};