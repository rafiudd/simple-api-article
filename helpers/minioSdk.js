const Minio = require('minio');
const dotenv = require('dotenv');
dotenv.config();
const wrapper = require('./wrapper')

let minioClient = new Minio.Client({
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MNIO_SECRET_KEY,
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false
  }
);

const isBucketExist = (bucketName) => {
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(bucketName, (err, exists) => {
      if (err) {
        console.log('minioSdk-isBucketExist', err.message, 'error check bucket');
        reject(err);
      }
      resolve(exists ? true : false);
    });
  });
};

const bucketCreate = async (bucketName, region = 'us-east-1') => {
  try {
    const isExists = await isBucketExist(bucketName);
    if (isExists) {
      return wrapper.wrapper_success(true);
    }
    await minioClient.makeBucket(bucketName, region);
    return "sukses"
  } catch (err) {
    console.log('minioSdk-bucketCreate', err.message, 'error create bucket');
    return wrapper.wrapper_error(err);
  }
};

const bucketRemove = async (bucketName) => {
  try {
    await minioClient.removeBucket(bucketName);
    return "sukses"
  } catch (err) {
    console.log('minioSdk-bucketRemove', err.message, 'error remove bucket');
    return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
  }
};

const objectUpload = async (bucketName, objectName, filePath) => {
  try {
    const isUploaded = await minioClient.fPutObject(bucketName, objectName, filePath);
    if (isUploaded) {
      return isUploaded;
    }
  } catch (err) {
    console.log('minioSdk-objectUpload', err.message, 'error upload object');
    return err       
  }
};

const objectDownload = async (bucketName, objectName, filePath) => {
  try {
    const isDownloaded = await minioClient.fGetObject(bucketName, objectName, filePath);
    if (isDownloaded) {
      return wrapper.wrapper_success(isDownloaded);
    }
  } catch (err) {
    console.log('minioSdk-objectDownload', err.message, 'error download object');
    return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')             
  }
};

const removeObject = async (bucketName, objectName) => {
  try {
    await minioClient.removeObject(bucketName, objectName);
    const data = {
      status: true,
      message: 'Object Removed'
    };
    console.log(data);
    return data;
  } catch (err) {
    const data = {
      status: false,
      message: 'Object Can`t Removed',
      err
    };
    console.log(data);
    return data;
  }
};

const objectGetUrl = async (bucketName, objectName, expiry = 604800) => {
  try {
    const getUrl = await minioClient.presignedGetObject(bucketName, objectName, expiry);
    return wrapper.wrapper_success(getUrl);
  } catch (err) {
    console.log('minioSdk-objectUrl', err.message, 'error get object url');
    return wrapper.wrapper_error(err);
  }
};

module.exports = {
  isBucketExist,
  bucketCreate,
  bucketRemove,
  objectUpload,
  objectGetUrl,
  objectDownload,
  removeObject
};