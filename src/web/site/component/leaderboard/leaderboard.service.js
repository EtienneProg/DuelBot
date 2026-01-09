const {getTop10Players} = require("../../../../database/users/user.database");
const {leaderboardfooter, leaderboardheader}= require("./leaderboard.base");
const {playerComponent, playerEmptyComponent} = require("./player");

async function getLeaderboard(){
    const players = await getTop10Players()
    const nbPlayers = players.length
    const nbEmpty = 10 - nbPlayers

    let leaderboardComponent = leaderboardheader

    leaderboardComponent += players.map(player => playerComponent(player)).join("\n")

    // Ajout des emplacements vides
    for (let i = 0; i < nbEmpty; i++) {
        const rank = nbPlayers + i + 1; // calcul du rang pour chaque emplacement vide
        leaderboardComponent += playerEmptyComponent(rank);
    }

    leaderboardComponent += leaderboardfooter

    return leaderboardComponent
}

module.exports = {getLeaderboard}
