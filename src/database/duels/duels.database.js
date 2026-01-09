const db = require("../sqlite");
const {getUsersByIds} = require("../users/user.database");

async function getRecentDuels() {
    return new Promise((resolve, reject) => {
        db.all(
            `
          SELECT *
          FROM duels
          ORDER BY created_at DESC
          LIMIT 6
          `,
            async (err, duels) => {
                if (err) return reject(err);

                const results = [];
                let usedSlots = 0;

                for (const duel of duels) {
                    if (usedSlots >= 6) break;

                    const team1Ids = JSON.parse(duel.team1_ids);
                    const team2Ids = JSON.parse(duel.team2_ids);

                    const estTeam = team1Ids.length > 1 || team2Ids.length > 1;
                    const duelSlots = estTeam ? 2 : 1;

                    if (usedSlots + duelSlots > 6) break;

                    const usersIds = [...team1Ids, ...team2Ids];

                    const users = await getUsersByIds(usersIds);

                    const team1 = team1Ids.map(id => {
                        const user = users.find(u => u.user_id === id);
                        return {
                            username: user?.username ?? "Unknown",
                            avatar: user?.avatar ?? null,
                            win: duel.winner_team === 1
                        };
                    });

                    const team2 = team2Ids.map(id => {
                        const user = users.find(u => u.user_id === id);
                        return {
                            username: user?.username ?? "Unknown",
                            avatar: user?.avatar ?? null,
                            win: duel.winner_team === 2
                        };
                    });

                    results.push({
                        duelEnCours: duel.is_finished === 0,
                        team1,
                        team2,
                        estTeam
                    });

                    usedSlots += duelSlots;
                }
                resolve(results);
            }
        );
    });
}

async function getDuelEnCours() {
    return new Promise((resolve, reject) => {
        db.get(
            `
          SELECT *
          FROM duels
          WHERE is_finished  = 0
          `,
            (err, duel) => {
                if (err) return reject(err);
                resolve(duel);
            }
        )
    })
}

module.exports = {getRecentDuels, getDuelEnCours};
