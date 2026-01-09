const db = require("../database/sqlite");
const duelState = require("./duel.state");
const {createOrUpdateHistoryMessage, deleteHistoryMessage} = require("./duel.history");

async function createDuelInDb(team1Ids, team2Ids) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO duels (team1_ids, team2_ids)
             VALUES (?, ?)`,
            [JSON.stringify(team1Ids), JSON.stringify(team2Ids)],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}

async function finishDuel(winnerTeam) {

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE duels
             SET winner_team = ?,
                 is_finished = 1
             WHERE id = ?`,
            [winnerTeam, duelState.duelId],
            err => err ? reject(err) : resolve()
        );
    });
}

async function deleteDuel() {
    await deleteHistoryMessage();


    if (!duelState.duelId) return;

    db.run(
        `DELETE
         FROM duels
         WHERE id = ?`,
        [duelState.duelId]
    );
}

async function getActiveInscriptionMembers(guild) {
    const userIds = await getActiveInscriptionUserIds();

    const members = [];

    for (const userId of userIds) {
        try {
            const member = await guild.members.fetch(userId);
            members.push({
                id: member.id,
                displayName: member.displayName,
                member // optionnel si tu veux garder l'objet Discord
            });
        } catch {
            // utilisateur plus dans le serveur → ignoré
        }
    }

    return members;
}


function getActiveInscriptionUserIds() {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT users_ids FROM inscriptions WHERE is_active = 1",
            (err, rows) => {
                if (err) return reject(err);

                const allIds = [];

                for (const row of rows) {
                    try {
                        const ids = JSON.parse(row.users_ids);
                        if (Array.isArray(ids)) {
                            allIds.push(...ids);
                        }
                    } catch {}
                }

                // Supprime les doublons
                resolve([...new Set(allIds)]);
            }
        );
    });
}





module.exports = { createDuelInDb, finishDuel, deleteDuel, getActiveInscriptionMembers};
