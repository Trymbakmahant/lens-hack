# Wherewolf for Lens Spring hackathon

## Lens primitives used
- Grove for storage of some files
- Lens chain for messaging

We also implemented the web3 connection with family wallet.

## Rule of the wherewolf game
For this hackathon, we choose to focus on a game for 3 players in one round - mainly because of implementation time constraint.

The 3 players consist of 1 wherewolf and 2 villagers.

At the beginning of the game, the roles are randomly attributed, here one random number between 0 and 2 is drawn for the wherewolf.

The roles are only known to their owner.

The players discuss during the day (5mn) and at the end of the discussion vote to designate and kill the potential wherewolf.

If the 2 villagers vote against the wherewolf, they win.

Otherwise, the wherewolf win (if there is a majority vote against a villager or a draw - because the wherewolf kills the remaining villager in the next night(s))

## Main challenges in a decentralized context
1. Randomness of role attribution. On-chain randomness is notably hard. Oracles (VRF) are available but not pefectly reliable.
The Opcode 'Prevrandao' can alse be used but the implementation is beyond our expertise and has limits. See eg https://eth2book.info/bellatrix/part2/building_blocks/randomness/

2. Authorization for role retrieval and secret actions/discussions.
Only the player should be able to access their role during the game.
Only a wherewolf should be able to kill or discuss with other wherewolfs in a game with more players/wherewolfs.

## Main solution for this hackathon: use a central server
Mainly because of implementation time constraint in this hackathon, we chose to use a central server.
More precisely, the backend is a [cloudflare function](https://developers.cloudflare.com/pages/functions/). Games are stored in [cloudflare KV](https://developers.cloudflare.com/kv/).
1. Randomness is handled locally in the server.

2. Authorization is handled on the cloudflare function with a 2 step process, kind of analogous to Oauth2.
We use the feature that, for player verification, a grove file with an ACL related to an address can only be modified with a signature from the owner of said address.
- first call to the function checks that a grove file exists and returns a random uuid - like a token
- second call with uuuid checks for the grove file modification, attesting that the player has ownership to return the role (wherewolf or not)

The main flow of the application is shown in the following sequence diagram:
![sequenceDiagram](https://github.com/user-attachments/assets/817af554-247b-4bab-93cf-f8f21bc30c06)

In the `worker` directory, another sequence diagram shows in more details the cloud function implememtation details.

## Extension for possible future developments
Beyond extending the game to more players, our main focus would be on the decentralization of the system
1. Implement onchain VRF.

2. Use encryption techniques to hide palyer roles and
zero-knowledge proofs to allow players to prove cerain statements about their role without revealing the roles themselves.

