const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

const storage = multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read-write',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

module.exports = {
    s3,
    storage
}
