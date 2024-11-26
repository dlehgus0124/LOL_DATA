const axios = require('axios')
const {get_champs_data} = require('./positionSorting.js')

const getRunes = async (positionCode, champCode) => {
    // 룬 데이터를 가져온 후 필요한 정보만 추출
    const runeData = await axios.get('https://ddragon.leagueoflegends.com/cdn/14.11.1/data/ko_KR/runesReforged.json')
        .then((response) => {
            return response.data.map(rune => {
                return rune.slots.flatMap(slot =>
                    slot.runes.map(r => ({
                        id: r.id, 
                        icon: r.icon,
                        name: r.name,
                        category: rune.id // 해당 룬의 카테고리 (지배, 영감 등)
                    }))
                );
            }).flat();
        });

    // 챔피언별 룬 정보를 가져옴
    const champRuneIds = await get_champs_data(positionCode, champCode);
    const bestPrimaryPerks = champRuneIds.stylesPrimary[0][0].split(',').map(Number);  // 메인 룬
    const bestSubPerks = champRuneIds.stylesSub[0][0].split(',').map(Number);  // 보조 룬

    // 주 룬과 보조 룬 필터링
    const primaryRunes = runeData.filter(rune => bestPrimaryPerks.includes(rune.id));
    const subRunes = runeData.filter(rune => bestSubPerks.includes(rune.id));

    // 룬 라벨링 (각각의 룬에 카테고리 이름 추가)
    const runeCategories = {
        "지배": ["8100", "8112", "8124", "8128", "9923", "8126", "8139", "8143", "8136", "8120", "8138", "8135", "8134", "8105", "8106"],
        "영감": ["8300", "8351", "8360", "8369", "8306", "8304", "8313", "8321", "8316", "8345", "8347", "8410", "8352"],
        "정밀": ["8000", "8005", "8008", "8021", "8010"],
        "전설": ["9101", "9111", "8009", "9104", "9105", "9103"],
        "결단": ["8014", "8017", "8299"],
        "수호": ["8437", "8439", "8465", "8446", "8463", "8401"],
        "결의": ["8429", "8444", "8473", "8451", "8453", "8242"],
        "마법": ["8214", "8229", "8230", "8224", "8226", "8275", "8210", "8234", "8233", "8237", "8232", "8236"]
    };

    // 룬 라벨링
    const labelRunes = (runes, categories) => {
        return runes.map(rune => {
            for (let [category, runeIds] of Object.entries(categories)) {
                if (runeIds.includes(rune.id.toString())) {
                    rune.category = category;
                    break;
                }
            }
            return rune;
        });
    };

    // primaryRunes와 subRunes에 라벨 추가
    const labeledPrimaryRunes = labelRunes(primaryRunes, runeCategories);
    const labeledSubRunes = labelRunes(subRunes, runeCategories);

    // 아이템 데이터 가져오기
    const itemData = await axios.get('https://ddragon.leagueoflegends.com/cdn/12.19.1/data/ko_KR/item.json')
        .then(response => response.data.data);

    // 아이템 코드를 숫자 배열로 변환
    const itemCodes = champRuneIds.items.map(Number);

    // 아이템 이름을 아이템 ID와 매칭
    const labeledItems = itemCodes.map(itemCode => {
        const item = itemData[itemCode];
        if (item) {
            return {
                id: itemCode,
                name: item.name,   // 아이템 이름
            };
        }
        return null;
    }).filter(item => item !== null);

    // 반환값
    return {  labeledPrimaryRunes, labeledSubRunes, labeledItems  };
};

module.exports = { getRunes };