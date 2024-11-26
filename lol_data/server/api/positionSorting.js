const fs = require('fs');
const path = require('path');

async function readJsonFile(filename) {
    const absolutePath = path.resolve(__dirname, filename);
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(fileContent);
}


async function count_combinations(df_test) {
    const count = {};
    df_test.forEach(item => {
        Object.keys(item).forEach(key => {
            if (key !== 'champCode') {
                count[key] = count[key] || {};
                const value = item[key];
                count[key][value] = (count[key][value] || 0) + 1;
            }
        });
    });
    Object.keys(count).forEach(key => {
        count[key] = Object.entries(count[key]).sort((a, b) => b[1] - a[1]);
    });
    return count;
}

async function get_champs_data(position_code, champ_code) {
    champ_code = parseInt(champ_code);
    position_code = parseInt(position_code);

    const result_data = await readJsonFile('./final_data.json');
    
    let fetch_data = [];
    result_data.forEach(row => {
        if (row.champ_code.includes(champ_code)) {
            if (row.champ_code.indexOf(champ_code) === position_code - 1) {
                fetch_data.push({
                    champCode: champ_code,
                    statperks: row.statperks[position_code - 1],
                    stylesPrimary: row.styles_primary[position_code - 1],
                    stylesSub: row.styles_sub[position_code - 1],
                    items: row.items[position_code - 1],
                    position: position_code
                });
            }
        }

    });
    
    const combi_data = await count_combinations(fetch_data);
    
    
    // 1단계: 배열 평탄화 및 필터링
    const flatFilteredArray = combi_data.items
        .slice(0, 50)
        .map(item => item[0].split(',').map(item => parseInt(item)))
        .flat()
        .filter(item =>
            item !== 0 && item !== 3340 && item !== 3047 && item !== 1054 && item !== 1036 && item !== 2055
        );

    // 2단계: 카운트
    const counts = flatFilteredArray.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});

    // 3단계: 정렬
    const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);


    const result = {
        position: position_code,
        champCode: champ_code,
        statPerks: combi_data.statperks.slice(0, 3).map(item => item), // Assuming item is already the correct structure
        stylesPrimary: combi_data.stylesPrimary.slice(0, 3).map(item => item),
        stylesSub: combi_data.stylesSub.slice(0, 3).map(item => item),
        items: sortedCounts.slice(0, 6).map(item => item[0])
    };

    return result;
}


module.exports = {
    get_champs_data
}