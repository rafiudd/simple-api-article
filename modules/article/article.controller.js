const express = require('express');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const slugify = require('slugify')
const router = express.Router();
dotenv.config();

const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const { Article } = require('../../helpers/db');
const uploads = require('../../helpers/uploadBase64');
const minio = require('../../helpers/minioSdk');

router.post('/create', createArticle);
router.get('/all', getAllArticle);
router.get('/', getDetailArticle);
router.delete('/delete/:articleId', deleteArticle);
router.put('/update/:articleId', updateArticle);
module.exports = router;

async function createArticle(req,res) {
   try {
        let { body } = req;
        let slugTitle = slugify(body.title, {
            lower: true
        });

        const bucket = process.env.MINIO_BUCKET;
        let checkBucket = await minio.isBucketExist(bucket);

        if(!checkBucket) {
          await minio.bucketCreate(bucket);
        }

        const objectName = {
            folder: body.title,
            filename: slugTitle
        };

        let uploadPhoto = await uploads.uploadImages(bucket, body.image, objectName);

        if (uploadPhoto.err) {
            return wrapper.wrapper_error(res, httpError.INTERNAL_ERROR, 'error upload to minio');
        }

        let model = {
            articleId: uuidv4(),
            title: body.title,
            description: body.description,
            image: uploadPhoto,
            tag: body.tag,
            slug: slugTitle
        }

        const isExist = await Article.findOne({ "title" : model.title });
    
        if(isExist) {
            return response.wrapper_error(res, httpError.CONFLICT, "article already taken");
        }

        let article = new Article(model)
        let command = await article.save();

        return response.wrapper_success(res, 200, 'Success create article', command);
   } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");
   }
}

async function getAllArticle(req, res) {
    try {
        let page = parseInt(req.query.page);
        let size = parseInt(req.query.size);
        let parameterPage = size * (page - 1);
        let query = await Article.find().sort({"createdAt": -1}).limit(size).skip(parameterPage);
        let totalData = await Article.count();
        let result = [];

        query.map((value) => {
            let model = {
                articleId: value.articleId,
                title: value.title,
                image: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${value.image}`,
                description: value.description,
                slug: value.slug,
                tag: value.tag,
                createdAt: value.createdAt,
                updateAt: value.updateAt
            }

            result.push(model)
        });

        const metaData = {
            page: page,
            size: size,
            totalData: totalData,
            totalPages: Math.ceil(totalData / size)
        };

        return response.paginationData(res, result, metaData, 'Success get all article', 200);
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");
    }
}

async function getDetailArticle(req, res) {
    try {
        let { query } = req;
        let { slug, articleId } = query;
        let queryData;

        if(slug) {
            queryData = await Article.findOne({ "slug": slug });
        }

        if(articleId) {
            queryData = await Article.findOne({ "articleId": articleId });
        }

        if(!slug && !articleId || slug && articleId) {
            return response.wrapper_error(res, httpError.SERVICE_UNAVAILABLE, "sorry, wrong parameter");
        }

        if(!queryData) {
            return response.wrapper_error(res, httpError.SERVICE_UNAVAILABLE, "sorry, article not available");
        }

        let result = {
            articleId: queryData.articleId,
            title: queryData.title,
            image: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${queryData.image}`,
            description: queryData.description,
            slug: queryData.slug,
            tag: queryData.tag,
            createdAt: queryData.createdAt,
            updateAt: queryData.updateAt
        }
        return response.wrapper_success(res, 200, 'Success get detail article', result);
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");
    }
}

async function deleteArticle(req, res) {
    try {
        let { params } = req;
        let { articleId } = params;
        let queryData = await Article.findOneAndDelete({ "articleId": articleId });

        if(!queryData) {
            return response.wrapper_error(res, httpError.SERVICE_UNAVAILABLE, "sorry, article not available");
        }

        let removeImage = await minio.removeObject(process.env.MINIO_BUCKET, queryData.image);

        if(!removeImage) {
            return wrapper.wrapper_error(res, httpError.INTERNAL_ERROR, 'error delete image');
        }

        return response.wrapper_success(res, 201, 'Success delete article', queryData);
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");
    }
}

async function updateArticle(req, res) {
    try {
        let { params, body } = req;
        let { articleId } = params;
        let slugTitle = slugify(body.title, {
            lower: true
        });

        let queryData = await Article.findOne({ "articleId": articleId });
        
        if(!queryData) {
            return response.wrapper_error(res, httpError.SERVICE_UNAVAILABLE, "sorry, article not available");
        }

        if(body.image) {
            let removeImage = await minio.removeObject(process.env.MINIO_BUCKET, queryData.image);

            if(!removeImage) {
                return wrapper.wrapper_error(res, httpError.INTERNAL_ERROR, 'error delete image');
            }
        }

        const objectName = {
            folder: body.title,
            filename: slugTitle
        };

        const bucket = process.env.MINIO_BUCKET;


        let uploadPhoto = await uploads.uploadImages(bucket, body.image, objectName);

        if (uploadPhoto.err) {
            return wrapper.wrapper_error(res, httpError.INTERNAL_ERROR, 'error upload to minio');
        }

        let model = {
            title: body.title ? body.title: queryData.title,
            description: body.description ? body.description: queryData.description,
            image: uploadPhoto ? uploadPhoto: queryData.image,
            tag: body.tag ? body.tag: queryData.tag,
            updateAt: new Date().toISOString()
        }

        let command = await Article.updateOne({ "articleId": articleId }, model)
        return response.wrapper_success(res, 201, 'Success update article', command);
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");        
    }
}