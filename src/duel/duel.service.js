const db = require("../database/sqlite");
const duelState = require("./duel.state");
const { deleteHistoryMessage } = require("./duel.history");
const { registerFont } = require("canvas");
const { EmbedBuilder} = require("discord.js");
const { getUsers} = require("../database/users/user.database");
const path = require("path");

registerFont(path.resolve("./public/fonts/Roboto-Regular.ttf"), {
    family: "Roboto",
});

async function createDuelInDb(team1Ids, team2Ids) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO duels (team1_ids, team2_ids, id_message)
             VALUES (?, ?, ?)`,
      [JSON.stringify(team1Ids), JSON.stringify(team2Ids), duelState.messageID],
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
      (err) => (err ? reject(err) : resolve())
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
        member, // optionnel si tu veux garder l'objet Discord
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
async function updateLeaderBoard(client) {
  const channel = await client.channels.fetch(
    process.env.CHANNEL_LEADERBOARD_ID
  );

  try {
    const messages = await channel.messages.fetch({ limit: 100 }); // récupère les 100 derniers messages
    await channel.bulkDelete(messages, true); // true pour ignorer les messages trop vieux
    console.log("✅ Channel vidé");
  } catch (err) {
    console.error("❌ Impossible de vider le channel :", err);
  }

  await createLeaderboardImage(channel);
}

// async function createLeaderboardImage(channel) {
//     const players = await getTop10Players();
//
//     const width = 800;
//     const height = 1000;
//     const canvas = createCanvas(width, height);
//     const ctx = canvas.getContext("2d");
//
//     /* ===== FOND ===== */
//     const gradient = ctx.createLinearGradient(0, 0, 0, height);
//     gradient.addColorStop(0, "#0f2027");
//     gradient.addColorStop(1, "#203a43");
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, width, height);
//
//     /* ===== TITRE ===== */
//     ctx.fillStyle = "#ffffff";
//     ctx.font = "bold 48px Roboto";
//     ctx.textAlign = "center";
//     ctx.fillText("LEADERBOARD", width / 2, 70);
//
//     let startY = 140;
//
//     for (let i = 0; i < players.length; i++) {
//         const player = players[i];
//         const user = await channel.client.users.fetch(player.user_id);
//
//         const y = startY + i * 80;
//
//         ctx.font = "40px Roboto";
//         ctx.fillText(`#${i + 1}`, 70, y + 35);
//
//         /* ===== AVATAR ===== */
//         const avatar = await loadImage(
//             user.displayAvatarURL({ extension: "png", size: 128 })
//         );
//         ctx.save();
//         ctx.beginPath();
//         ctx.arc(140, y + 30, 30, 0, Math.PI * 2);
//         ctx.closePath();
//         ctx.clip();
//         ctx.drawImage(avatar, 110, y, 60, 60);
//         ctx.restore();
//
//         /* ===== NOM ===== */
//         ctx.font = "bold 26px Roboto";
//         ctx.fillStyle = "#ffffff";
//         ctx.textAlign = "left";
//         ctx.fillText(user.username, 200, y + 40);
//
//         /* ===== SCORE ===== */
//         ctx.font = "24px Roboto";
//         ctx.fillStyle = "#00ffcc";
//         ctx.textAlign = "right";
//         ctx.fillText(`${player.score} pts`, width - 80, y + 40);
//
//         /* ===== SEPARATEUR ===== */
//         ctx.strokeStyle = "rgba(255,255,255,0.1)";
//         ctx.beginPath();
//         ctx.moveTo(60, y + 70);
//         ctx.lineTo(width - 60, y + 70);
//         ctx.stroke();
//     }
//
//     /* ===== ENVOI ===== */
//     const attachment = new AttachmentBuilder(canvas.toBuffer(), {
//         name: "leaderboard.png",
//     });
//
//     await channel.send({ files: [attachment] });
// }

async function createLeaderboardImage(channel) {
    const rows = await getUsers();
    const badges = ['🥇', '🥈', '🥉'];
    const chunkSize = 20;

    for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);

        let leaderboardText = 'Rang | Score  | Utilisateur\n\n';

        for (let localIndex = 0; localIndex < chunk.length; localIndex++) {
            const entry = chunk[localIndex];
            const globalIndex = i + localIndex;
            const badge = badges[globalIndex] || `#${globalIndex + 1}`;
            const rank = badge.padEnd(3, ' ');
            const score = entry.score.toString().padStart(7, ' ');

            // Récupération du nom d'utilisateur
            let username;
            try {
                const user = await channel.client.users.fetch(entry.user_id);
                username = user.displayName ?? user.username;
            } catch {
                username = `Utilisateur inconnu`;
            }

            const name = username.padEnd(20, ' ');
            leaderboardText += `${rank} | ${score} | ${name}\n`;
        }

        const pageLabel = rows.length > chunkSize
            ? `🏆 Leaderboard (${Math.floor(i / chunkSize) + 1}/${Math.ceil(rows.length / chunkSize)})`
            : '🏆 Leaderboard';

        const leaderboardEmbed = new EmbedBuilder()
            .setTitle(pageLabel)
            .setDescription('```' + leaderboardText + '```')
            .setColor(0x00FF00)
            .setFooter({ text: 'Mise à jour automatique du leaderboard' })
            .setTimestamp();

        await channel.send({ embeds: [leaderboardEmbed] });
    }
}



module.exports = {
  createDuelInDb,
  finishDuel,
  deleteDuel,
  getActiveInscriptionMembers,
  updateLeaderBoard,
};
