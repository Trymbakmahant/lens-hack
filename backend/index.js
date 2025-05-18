const GAMES = {};
const NB_PLAYERS = 3;
const GAME_DURATION = 60 * 5; // 5 minutes

async function getState(groveId) {
  const url = "https://api.grove.storage/" + groveId;
  const res = await fetch(url);
  const data = await res.json();
  return data?.state;
}


// returns
// - random uuid if player not in the game - grove file checked for state 0, ie not commited
// - isWherewolf and revealTime (if set) before reveal time - if player passes correct random uuid and grove file new state is 1
// - grove id of wherewolf after reveal time - if player passes correct random uuid
// TODO maybe return lensId in last case, need grove file wih format { state, lensId }
// TODO maybe open game result if random uuid is not passed/correct after reveal time
async function postGame(gameId, groveId, uuid) {
  if (!groveId) throw new Error('groveId is required')
  if (typeof gameId !== 'string' || gameId.length !== 36) throw new Error('gameId is required')

  if (!GAMES[gameId]) {
    const state = await getState(groveId);
    if (state !== 0) throw new Error('state 0 is required');
    
    const newUuid = crypto.randomUUID();
    GAMES[gameId] = {
      players: [[groveId, newUuid, false]], // false for not commited,
      wherewolfIndex: Math.floor(Math.random() * NB_PLAYERS),
    }

    return { uuid: newUuid };
  }

  const players = GAMES[gameId].players;
  const playerIndex = players.findIndex(player => player[0] === groveId);
  const player = players[playerIndex];
  if (!player) {
    if (players.length >= NB_PLAYERS) throw new Error('game is full');

    const state = await getState(groveId);
    if (state !== 0) throw new Error('state 0 is required');

    const newUuid = crypto.randomUUID();
    players.push([groveId, newUuid, false]); // false for not commited
    return { uuid: newUuid };
  }

  if (player[1] !== uuid) throw new Error('invalid uuid');
  
  if (
    players.map(p => p[2]).every(p => p) &&
    Math.floor(new Date()/1000) > GAMES[gameId].revealTime
  ) {
    const wherewolfGroveId = players[GAMES[gameId].wherewolfIndex][0];
    return { wherewolfGroveId };
  }

  if (!player[2]) player[2] = true; // set to true for commited

  if (players.map(p => p[2]).every(p => p)) {
    GAMES[gameId].revealTime = Math.floor(new Date()/1000) + GAME_DURATION;
  }

  const isWherewolf = playerIndex === GAMES[gameId].wherewolfIndex;
  return  { isWherewolf, revealTime: GAMES[gameId].revealTime };
}

(async () => {
  const gameId = '8370814a0f6f3402129eb775d3379498c42d';
  const groveId = 'a32b6580bc2b869e6ab855a5cf35062499d1e66422bd7f41ea8794d78b01c114';
  const res = await postGame(gameId, groveId, null);
  console.log(res);
})();