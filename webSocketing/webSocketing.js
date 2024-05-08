import { createWebSocketConnection } from 'league-connect'

const ws = await createWebSocketConnection({
  authenticationOptions: {
    awaitConnection: true
  },
  pollInterval: 1000,
  maxRetries: 10
})

let puuid = null;

const messageHandler = message => {
  const str = message.toString();
  try {
    // 문자열을 JSON으로 변환
    const data = JSON.parse(str);
    if(data[2].uri.includes('/lol-chat/v1/conversations/') && Object.keys(data[2].data).includes('puuid')){
      if (puuid === null) {
        puuid = data[2].data.puuid;
        console.log(puuid);
        // 원하는 값을 얻었으므로 이벤트 핸들러를 제거합니다.
        ws.off('message', messageHandler);
      }
    }  
  } catch (err) {
    console.error('JSON 파싱 오류:', err);
  }
};

ws.on('message', messageHandler);

let previousActions = null;

const subscribeToSession = (eventHandler) => {
  ws.subscribe('/lol-champ-select-legacy/v1/session', async (data, event) => {
      try {
          if (JSON.stringify(data.actions) !== JSON.stringify(previousActions)) {
            let initialList = data.actions[0]
            let championIds = initialList.map(data => data.championId);

            let myTeamList = data.myTeam;
            let puuidList = myTeamList.map(data => data.puuid);
            
            eventHandler(championIds, puuidList);
            previousActions = data.actions;
          }
      } catch (err) {
          console.error('에러 발생:', err);
      }
  })
}

const handleEvent = async (championIds, puuidList) => {
    console.log(championIds);
    console.log(puuidList);
    let index;

    if(puuid !== null){
      index = puuidList.indexOf(puuid);
      console.log(championIds[index]);
    }
}

subscribeToSession(handleEvent)