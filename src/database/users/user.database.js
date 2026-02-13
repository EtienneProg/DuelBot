const db = require("../sqlite");

function upsertUserFromMember(member) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT user_id FROM users WHERE user_id = ?",
            [member.id],
            (err, row) => {
                if (err) return reject(err);

                const username = member.displayName || member.user.username;
                const avatar = member.user.avatarURL() || "";

                if (!row) {
                    db.run(
                        `
            INSERT INTO users (user_id, username, avatar, score)
            VALUES (?, ?, ?, 1000)
            `,
                        [member.id, username, avatar],
                        err => (err ? reject(err) : resolve("created"))
                    );
                } else {
                    db.run(
                        `
            UPDATE users
            SET username = ?, avatar = ?
            WHERE user_id = ?
            `,
                        [username, avatar, member.id],
                        err => (err ? reject(err) : resolve("updated"))
                    );
                }
            }
        );
    });
}

function getUsersByIds(ids) {
    return new Promise((resolve, reject) => {
        if (ids.length === 0) return resolve([]);

        const placeholders = ids.map(() => "?").join(",");

        db.all(
            `
      SELECT user_id, username, avatar
      FROM users
      WHERE user_id IN (${placeholders})
      `,
            ids,
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}


async function getTop10Players() {
    const rows = await new Promise((resolve, reject) => {
        db.all(
            `
      SELECT 
        user_id,
        username,
        avatar,
        score,
        last_match,
        last_match_win,
        nb_win,
        nb_lose
      FROM users
      ORDER BY score DESC
      LIMIT 10
      `,
            [],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });

    return await Promise.all(

    rows.map(async (row, index) => {

        let color = 'cyan';
        if (index === 0) color = 'yellow';
        else if (index === 1) color = 'gray';
        else if (index === 2) color = 'orange';

        const rank = await getRank(row.score);

        return {
            user_id: row.user_id,
            rank: index + 1,
            username: row.username,
            avatar: row.avatar || "",
            score: row.score.toLocaleString("fr-FR"),
            color,
            lastMatchIcon: row.last_match_win === 1 ? "🏆" : "❌",
            lastMatch: row.last_match ?? "—",
            victory: row.nb_win ?? 0,
            lost: row.nb_lose ?? 0,
            level: rank.name ?? "",
        };
    }));
}

async function getUsers() {
    return await new Promise((resolve, reject) => {
        db.all(
            `
      SELECT 
          *
      FROM users
      ORDER BY score DESC
      `,
            [],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

async function getRank(score) {
    return new Promise((resolve, reject) => {
        db.get(
            `
      SELECT id, name, min_elo, max_elo
      FROM ranks
      WHERE min_elo <= ?
        AND (max_elo IS NULL OR max_elo >= ?)
      LIMIT 1
      `,
            [score, score],
            (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            },
        );
    });
}

module.exports = { upsertUserFromMember,getUsersByIds, getTop10Players, getUsers };
