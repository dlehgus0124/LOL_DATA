const AWS = require('aws-sdk');
const csv = require('csv-parser');
const stream = require('stream');
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: 'process.env.AWS_ACCESS_KEY_ID',
    secretAccessKey: 'process.env.AWS_SECRET_ACCESS_KEY',
    region: 'ap-northeast-2'
});

const params = {
    Bucket: 'riot.data',
    Key: 'Champion_list.csv'
};

const s3Stream = s3.getObject(params).createReadStream();

const champList = [];

s3Stream
        .pipe(csv())
        .on('data', (data) => {
            champList.push(data);
        })
        .on('end', () => {
            console.log('CSV file processing completed');
            fs.writeFile('champCode.json', JSON.stringify(champList, null, 2), (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
        });