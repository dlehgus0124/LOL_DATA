const axios = require('axios');
const api_key = 'RGAPI-b56cf1c8-b68f-404e-bae4-d0b432ac53b1'

const summonerInfo = async (summonerName, tagLine) => {
    const puuid = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tagLine}?api_key=${api_key}`)
        .then((res) => {
            return res.data.puuid;
        })

    const MatchList = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=30&api_key=${api_key}`)
        .then((res) => {
            return res.data;
        })

    let recentChamp = [];
    let matchDetail = await getGameDetail(MatchList);

    for (let i = 0; i < matchDetail.length; i++) {
        if (matchDetail[i].summonerName === summonerName) {
            recentChamp.push({
                champName: matchDetail[i].champName,
                champCode: matchDetail[i].champCode,
                win: matchDetail[i].win,
                kills: matchDetail[i].kills,
                deaths: matchDetail[i].deaths,
                assists: matchDetail[i].assists,
                dealt: matchDetail[i].dealt,
                taken: matchDetail[i].taken,
                dealt_per_minute: matchDetail[i].dealt / (matchDetail[i].duration / 60),
                taken_per_minute: matchDetail[i].taken / (matchDetail[i].duration / 60),
                dealt_per_taken: matchDetail[i].dealt / matchDetail[i].taken,
                vision: matchDetail[i].vision,
                heal: matchDetail[i].heal,
                cs: matchDetail[i].cs,
                duration: matchDetail[i].duration
            })
        }
    }
    const groupValues = recentChamp.reduce((acc, obj) => {
        if (acc[obj.champName]) {
            acc[obj.champName].kills = (acc[obj.champName].kill || 0) + obj.kills;
            acc[obj.champName].deaths = (acc[obj.champName].death || 0) + obj.deaths;
            acc[obj.champName].assists = (acc[obj.champName].assist || 0) + obj.assists;
            acc[obj.champName].dealt = (acc[obj.champName].dealt || 0) + obj.dealt;
            acc[obj.champName].taken = (acc[obj.champName].taken || 0) + obj.taken;
            acc[obj.champName].dealt_per_minute = (acc[obj.champName].dealt_per_minute || 0) + obj.dealt_per_minute;
            acc[obj.champName].taken_per_minute = (acc[obj.champName].taken_per_minute || 0) + obj.taken_per_minute;
            acc[obj.champName].dealt_per_taken = (acc[obj.champName].dealt_per_taken || 0) + obj.dealt_per_taken;
            acc[obj.champName].vision = (acc[obj.champName].vision || 0) + obj.vision;
            acc[obj.champName].heal = (acc[obj.champName].heal || 0) + obj.heal;
            acc[obj.champName].cs = (acc[obj.champName].cs || 0) + obj.cs;
            acc[obj.champName].duration = (acc[obj.champName].duration || 0) + obj.duration;
            acc[obj.champName].count = acc[obj.champName].count + 1;
            acc[obj.champName].victoryRate = Math.round(acc[obj.champName].win / acc[obj.champName].count) * 100;
        } else {
            acc[obj.champName] = obj;
            acc[obj.champName].count = 1;
            acc[obj.champName].victoryRate = Math.round(acc[obj.champName].win / acc[obj.champName].count) * 100;
        }
        return acc;
    }, {});

    const groups = Object.keys(groupValues).map(key => {
        return {
            championName: key,
            champCode: groupValues[key].champCode,
            kills: Number((groupValues[key].kills / groupValues[key].count).toFixed(2)),
            deaths: Number((groupValues[key].deaths / groupValues[key].count).toFixed(2)),
            assists: Number((groupValues[key].assists / groupValues[key].count).toFixed(2)),
            dealt: Number((groupValues[key].dealt / groupValues[key].count).toFixed(2)),
            taken: Number((groupValues[key].taken / groupValues[key].count).toFixed(2)),
            dealt_per_minute: Number((groupValues[key].dealt_per_minute / groupValues[key].count).toFixed(2)),
            taken_per_minute: Number((groupValues[key].taken_per_minute / groupValues[key].count).toFixed(2)),
            dealt_per_taken: Number((groupValues[key].dealt_per_taken / groupValues[key].count).toFixed(2)),
            vision: Number((groupValues[key].vision / groupValues[key].count).toFixed(2)),
            heal: Number((groupValues[key].heal / groupValues[key].count).toFixed(2)),
            cs: Number((groupValues[key].cs / groupValues[key].count).toFixed(2)),
            duration: Number((groupValues[key].duration / groupValues[key].count).toFixed(2)),
        }
    });
    return groups;
}

const getGameDetail = async (matchId) => {
    let oneGameParticipants = [];
    for (let i = 0; i < matchId.length; i++) {
        await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId[i]}?api_key=${api_key}`)
            .then((res) => {
                let gameDuration = res.data.info.gameDuration;
                let participants = res.data.info.participants;
                const gameStat = (participants) => {
                    for (let j = 0; j < 10; j++) {
                        let data = {
                            summonerName: participants[j].summonerName,
                            champCode: participants[j].championId,
                            champName: participants[j].championName,
                            win: participants[j].win,
                            kills: participants[j].kills,
                            deaths: participants[j].deaths,
                            assists: participants[j].assists,
                            dealt: participants[j].totalDamageDealtToChampions,
                            taken: participants[j].totalDamageTaken,
                            vision: participants[j].visionScore,
                            heal: participants[j].totalHeal,
                            cs: participants[j].totalMinionsKilled,
                            duration: gameDuration
                        }
                        oneGameParticipants.push(data);
                    }
                }
                gameStat(participants);
            })
    }
    return oneGameParticipants;
}

summonerInfo('조선제일GUM', 'KR')
    .then((data) => {
        console.log(data)
    })
    .catch((error) => {
        console.error(error);
    });

module.exports = { summonerInfo };