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
    Key: 'Unsaved/2024/05/07/win_lose_champList.csv'
};

const win_champList = [];
let combinedWinChampList = [];
let list = [];
let top = [];
let jungle = [];
let mid = [];
let bottom = [];
let support = [];

const getAWSData = () => {
    return new Promise((resolve, reject) => {
        const s3Stream = s3.getObject(params).createReadStream();

        s3Stream
            .pipe(csv())
            .on('data', (data) => {
                win_champList.push(data);
            })
            .on('end', () => {
                console.log('CSV file processing completed');
                for(let index = 0; index < win_champList.length; index++) {
                    const win_champ = JSON.parse(win_champList[index].win_champ);
                    combinedWinChampList = combinedWinChampList.concat(win_champ);
                    list.push(win_champ);
                }
                fs.writeFile('combination.json', JSON.stringify(list, null, 2), (err) => {
                    if (err) throw err;
                    console.log('Data written to file');
                });
                
                for(let index = 0; index < combinedWinChampList.length; index+=5) {
                    top.push(combinedWinChampList[index]);
                    jungle.push(combinedWinChampList[index+1]);
                    mid.push(combinedWinChampList[index+2]);
                    bottom.push(combinedWinChampList[index+3]);
                    support.push(combinedWinChampList[index+4]);
                }

                resolve(win_champList);
                // 모든 라인 통틀어 가장 많이 승리한 챔피언을 찾아내는 코드
                /*let count = {};
                combinedWinChampList.forEach((i) => {
                    count[i] = (count[i] || 0) + 1;
                });
                let entries = Object.entries(count);
                entries.sort((a, b) => b[1] - a[1]);

                fs.writeFile('winChamp.json', JSON.stringify(entries, null, 2), (err) => {
                    if (err) throw err;
                    console.log('Data written to file');
                });*/
                sorting();
            });
    });
}

const sorting = () => {
    const topCount = {};
    const jungleCount = {};
    const midCount = {};
    const bottomCount = {};
    const supportCount = {};

    top.forEach((i) => {
        topCount[i] = (topCount[i] || 0) + 1;
    });
    jungle.forEach((i) => {
        jungleCount[i] = (jungleCount[i] || 0) + 1;
    });
    mid.forEach((i) => {
        midCount[i] = (midCount[i] || 0) + 1;
    });
    bottom.forEach((i) => {
        bottomCount[i] = (bottomCount[i] || 0) + 1;
    });
    support.forEach((i) => {
        supportCount[i] = (supportCount[i] || 0) + 1;
    });

    let topEntries = Object.entries(topCount);
    let jungleEntries = Object.entries(jungleCount);
    let midEntries = Object.entries(midCount);
    let bottomEntries = Object.entries(bottomCount);
    let supportEntries = Object.entries(supportCount);

    topEntries.sort((a, b) => b[1] - a[1]);
    jungleEntries.sort((a, b) => b[1] - a[1]);
    midEntries.sort((a, b) => b[1] - a[1]);
    bottomEntries.sort((a, b) => b[1] - a[1]);
    supportEntries.sort((a, b) => b[1] - a[1]);

    fs.writeFile('top.json', JSON.stringify(topEntries, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    fs.writeFile('jungle.json', JSON.stringify(jungleEntries, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    fs.writeFile('mid.json', JSON.stringify(midEntries, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    fs.writeFile('bottom.json', JSON.stringify(bottomEntries, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    fs.writeFile('support.json', JSON.stringify(supportEntries, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

const main = async () => {
    await getAWSData();
}

main();