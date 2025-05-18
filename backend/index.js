const GAMES = {};
const NB_PLAYERS = 3;
const GAME_DURATION = 60 * 5; // 5 minutes

async function getState(groveId) {
  const url = "https://api.grove.storage/" + groveId;
  const res = await fetch(url);
  const data = await res.json();
  return data?.state;
}

async function postGame(gameId, groveId, randomUuid) {
  if (!groveId) throw new Error('groveId is required')
  if (typeof gameId !== 'string' || gameId.length !== 36) throw new Error('gameId is required')
 

  if (!GAMES[gameId]) {
    const state = await getState(groveId);
    if (state !== 0) throw new Error('state 0 is required');
    
    const newUuid = crypto.randomUUID();
    GAMES[gameId] = {
      players: [[groveId, newUuid, false]], // false for not commited,
      wherewolf: Math.floor(Math.random() * NB_PLAYERS),
    }
    console.log('GAMES', GAMES[gameId]);
    return newUuid;
  }

  const players = GAMES[gameId].players;
  const player = players.find(player => player[0] === groveId);
  if (!player) {
    if (players.length >= NB_PLAYERS) throw new Error('game is full');

    const state = await getState(groveId);
    if (state !== 0) throw new Error('state 0 is required');

    const newUuid = crypto.randomUUID();
    players.push([groveId, newUuid, false]); // false for not commited
    return newUuid;
  }

  if (player[1] !== randomUuid) throw new Error('invalid uuid');
  
  if (
    players.map(p => p[2]).every(p => p) &&
    Math.floor(new Date()/1000) > GAMES[gameId].revealTime
  ) {
    return players[GAMES[gameId].wherewolf][0];
  }

  if (!player[2]) {
    player[2] = true; // set to true for commited
    if (players.map(p => p[2]).every(p => p)) {
      const revealTime = Math.floor(new Date()/1000) + GAME_DURATION;
      GAMES[gameId].revealTime = revealTime;
      return revealTime;
    } else {
      return; // TODO ok
    }
  }

  throw new Error('not implemented');
}

(async () => {
  const gameId = '8370814a0f6f3402129eb775d3379498c42d';
  const groveId = 'a32b6580bc2b869e6ab855a5cf35062499d1e66422bd7f41ea8794d78b01c114';
  await postGame(gameId, groveId);
})();