const AWS = require('aws-sdk');
const csv = require('csv-parser');
const stream = require('stream');
const fs = require('fs');
const { match } = require('assert');

const s3 = new AWS.S3({
    accessKeyId: 'process.env.AWS_ACCESS_KEY_ID',
    secretAccessKey: 'process.env.AWS_SECRET_ACCESS_KEY',
    region: 'ap-northeast-2'
});

const params = {
    Bucket: 'riot.data',
    Key: 'ingame/bronze_ingame.csv'
};

const s3Stream = s3.getObject(params).createReadStream();

const ingameList = [];
s3Stream
        .pipe(csv())
        .on('data', async (data) => {
            const result = JSON.stringify(ingameList.push(data));
        })
        .on('end', () => {
            console.log('CSV file processing completed');
        });
console.log(ingameList);