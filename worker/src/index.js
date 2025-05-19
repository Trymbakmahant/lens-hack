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
async function postGame(GAMES, gameId, groveId, uuid) {
  if (!groveId) throw new Error('groveId is required')
  if (typeof gameId !== 'string' || gameId.length !== 36) throw new Error('gameId is required')

  const game = JSON.parse(await GAMES.get(gameId));
  if (!game) {
    const state = await getState(groveId);
    if (state !== 0) throw new Error('state 0 is required');
    
    const newUuid = crypto.randomUUID();
    await GAMES.put(gameId, JSON.stringify({
      players: [[groveId, newUuid, false]], // false for not commited,
      wherewolfIndex: Math.floor(Math.random() * NB_PLAYERS),
    }));

    return { uuid: newUuid };
  }

  const players = game.players;
  const playerIndex = players.findIndex(player => player[0] === groveId);
  const player = players[playerIndex];
  if (!player) {
    if (players.length >= NB_PLAYERS) throw new Error('game is full');

    const state = await getState(groveId);
    if (state !== 0) throw new Error('state 0 is required');

    const newUuid = crypto.randomUUID();
    players.push([groveId, newUuid, false]); // false for not commited
    await GAMES.put(gameId, JSON.stringify({ players, wherewolfIndex: game.wherewolfIndex }));
    return { uuid: newUuid };
  }

  if (player[1] !== uuid) throw new Error('invalid uuid');
  
  if (
    players.map(p => p[2]).every(p => p) &&
    Math.floor(new Date()/1000) > game.revealTime
  ) {
    const wherewolfGroveId = players[game.wherewolfIndex][0];
    return { wherewolfGroveId };
  }

  if (!player[2]) {
    const state = await getState(groveId);
    if (state !== 1) throw new Error('state 1 is required');

    player[2] = true; // set to true for commited
  }

  let revealTime = game.revealTime;
  if (!revealTime && players.map(p => p[2]).every(p => p)) {
    revealTime = Math.floor(new Date()/1000) + GAME_DURATION;
    await GAMES.put(gameId, JSON.stringify({ players, wherewolfIndex: game.wherewolfIndex, revealTime }));
  }

  const isWherewolf = playerIndex === game.wherewolfIndex;
  return { isWherewolf, revealTime };
}

// curl --request POST \
//   --url http://localhost:8787/ \
//   --header 'Content-Type: application/json' \
//   --data '{
// 	"gameId": "8370814a0f6f3402129eb775d3379498c42d",
// 	"groveId": "a32b6580bc2b869e6ab855a5cf35062499d1e66422bd7f41ea8794d78b01c114",
// 	"uuid": "3818bfc6-97f9-4a80-b091-31d51da3b684"
// }'
export default {
	async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      const message = 'Method not allowed';
      return new Response(
        JSON.stringify({ message }),
        { status: 405 }
      );
    }

    const { gameId, groveId, uuid } = await request.json();
    try {
      const data = await postGame(env.GAMES, gameId, groveId, uuid);
      // return a Workers response
      return new Response(
        JSON.stringify(data),
      );
    } catch (e) {
      const message = e.message || 'Unknown error';
      return new Response(
        JSON.stringify({ message }),
        { status: 400}
      );
    }
	},
};
