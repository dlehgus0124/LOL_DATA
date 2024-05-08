const fs = require('fs');

const data = JSON.parse(fs.readFileSync('combination.json', 'utf8'));

const TopJgCombination = () => {
    const topJg = [];
    data.forEach((data)=>{
        topJg.push({
            top: data[0],
            jungle: data[1]
        })
    })
    return topJg;
}

const JgMidCombination = () => {
    const JgMid = [];
    data.forEach((data)=>{
        JgMid.push({
            jg: data[1],
            mid: data[2]
        })
    })
    return JgMid;
}
const bottomSupportCombination = () => {
    const bottomSupport = [];
    data.forEach((data)=>{
        bottomSupport.push({
            bottom: data[3],
            support: data[4]
        })
    })
    return bottomSupport;
}

const getBestCombination = (data,p1,p2) => {
    let count = {};
    data.forEach((item) => {
        let key = `${item[p1]}-${item[p2]}`;
        count[key] = (count[key] || 0) + 1;
    });
    let maxCount = 0;
    let mostCommonCombination = null;
    for (let combination in count) {
        if (count[combination] > maxCount) {
            maxCount = count[combination];
            mostCommonCombination = combination;
        }
    }
    return {
        combination: mostCommonCombination,
        count: maxCount
    };
}

const bestCombinationtg = getBestCombination(TopJgCombination(), 'top', 'jungle');
const bestCombinationjm = getBestCombination(JgMidCombination(), 'jg', 'mid');
const bestCombinationbs = getBestCombination(bottomSupportCombination(), 'bottom', 'support');

console.log(bestCombinationtg);
console.log(bestCombinationjm);
console.log(bestCombinationbs);


