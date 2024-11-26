const { getRunes } = require('./getRunes_Items');
const fs = require('fs');
const path = './champList.json';

async function getInfo(position, champion) {
    const position_code = {
        '탑': 1,
        '정글': 2,
        '미드': 3,
        '원딜': 4,
        '서포터': 5
    }[position]

    let jsonData = []
    try {
        // 파일을 동기적으로 읽기
        const data = fs.readFileSync(path, 'utf8');  // 'utf8'로 인코딩을 지정
        jsonData = JSON.parse(data);  // JSON 파싱
    } catch (err) {
        console.error('파일을 읽는 중 오류 발생:', err);
    }

    const championLabel = jsonData.find(champ => champ.name === champion)
    const championCode = championLabel.key

    return await getRunes(position_code, championCode)
}

module.exports = {
    getInfo
}
