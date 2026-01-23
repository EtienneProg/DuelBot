const db = require("../database/sqlite");
const duelState = require("./duel.state");
const { deleteHistoryMessage } = require("./duel.history");
const { createCanvas, loadImage, registerFont } = require("canvas");
const { AttachmentBuilder } = require("discord.js");
const { getTop10Players } = require("../database/users/user.database");
const path = require("path");

registerFont(path.resolve("./public/fonts/Roboto-Regular.ttf"), {
    family: "Roboto",
});

registerFont("./public/fonts/NotoColorEmoji.ttf", { family: "NotoColorEmoji" });

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

async function createLeaderboardImage(channel) {
    const players = await getTop10Players();

    const width = 800;
    const height = 1000;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    /* ===== FOND ===== */
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0f2027");
    gradient.addColorStop(1, "#203a43");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    /* ===== TITRE ===== */
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px NotoColorEmoji";
    ctx.textAlign = "center";
    ctx.fillText("🏆 LEADERBOARD 🏆", width / 2, 70);

    let startY = 140;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const user = await channel.client.users.fetch(player.user_id);

        const y = startY + i * 80;

        /* ===== BADGE ===== */
        const badges = ["🥇", "🥈", "🥉"];
        ctx.font = "40px NotoColorEmoji";
        ctx.fillText(badges[i] || `#${i + 1}`, 70, y + 35);

        /* ===== AVATAR ===== */
        const avatar = await loadImage(
            user.displayAvatarURL({ extension: "png", size: 128 })
        );
        ctx.save();
        ctx.beginPath();
        ctx.arc(140, y + 30, 30, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 110, y, 60, 60);
        ctx.restore();

        /* ===== NOM ===== */
        ctx.font = "bold 26px NotoColorEmoji";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(user.username, 200, y + 40);

        /* ===== SCORE ===== */
        ctx.font = "24px NotoColorEmoji";
        ctx.fillStyle = "#00ffcc";
        ctx.textAlign = "right";
        ctx.fillText(`${player.score} pts`, width - 80, y + 40);

        /* ===== SEPARATEUR ===== */
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(60, y + 70);
        ctx.lineTo(width - 60, y + 70);
        ctx.stroke();
    }

    /* ===== ENVOI ===== */
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "leaderboard.png",
    });

    await channel.send({ files: [attachment] });
}



module.exports = {
  createDuelInDb,
  finishDuel,
  deleteDuel,
  getActiveInscriptionMembers,
  updateLeaderBoard,
};
