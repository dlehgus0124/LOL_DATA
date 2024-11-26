const express = require('express');
const app = express();
const {summonerInfo} = require('./api/getSummonerInfo')
const {getInfo} = require('./api/getInfo')
const cors = require('cors');

app.use(cors());

// /summonerInfo/{name}/{tag} 라우트
app.get('/summonerInfo/:name/:tag', async (req, res) => {
    const { name, tag } = req.params;  // 파라미터를 가져옴
    try {
        const result = await summonerInfo(name, tag);  // 예시: getInfo 비동기 함수 호출
        res.json(result);  // 결과를 JSON으로 반환
    } catch (err) {
        res.status(500).json({ error: 'Error fetching summoner info' });
    }
});

// /getChampInfo/{position}/{champion} 라우트
app.get('/getChampInfo/:position/:champion', async (req, res) => {
    const { position, champion } = req.params;  // 파라미터를 가져옴
    
    // 여기에 getInfo 함수와 같은 챔피언 정보 처리 로직 추가
    try {
        const result = await getInfo(position, champion);  // 예시: getInfo 비동기 함수 호출
        res.json(result);  // 결과를 JSON으로 반환
    } catch (err) {
        res.status(500).json({ error: 'Error fetching champion info' });
    }
});

// 포트 3000에서 서버 시작
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
