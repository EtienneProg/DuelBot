const { EmbedBuilder } = require("discord.js");
const duelState = require("./duel.state");

async function createOrUpdateHistoryMessage(client, options = {}) {
  const channel = await client.channels.fetch(
    process.env.HISTORIQUE_DUEL_CHANNEL_ID
  );
  if (!channel) return;

  const { status, winnerTeam = null } = options;

  // Construction embed
  const embed = new EmbedBuilder()
    .setTitle("🎮 Duel")
    .setColor(status === "ONGOING" ? 0xffd700 : 0x00ff00)
    .setTimestamp()
    .setFooter({ text: "Duel" });

  if (status === "ONGOING") {
    embed.setDescription("⚔️ **Duel en cours !**").addFields(
      {
        name: "Équipe 1",
        value: duelState.team1.map((u) => `<@${u}>`).join("\n") || "—",
        inline: true,
      },
      { name: "", value: "vs", inline: true },
      {
        name: "Équipe 2",
        value: duelState.team2.map((u) => `<@${u}>`).join("\n") || "—",
        inline: true,
      }
    );
  } else if (status === "FINISHED") {
    embed.setDescription(`🏆 **Équipe ${winnerTeam} a gagné !**`).addFields(
      {
        name: "Équipe 1",
        value: duelState.team1.map((u) => `<@${u}>`).join("\n") || "—",
        inline: true,
      },
      { name: "", value: "vs", inline: true },
      {
        name: "Équipe 2",
        value: duelState.team2.map((u) => `<@${u}>`).join("\n") || "—",
        inline: true,
      }
    );
  }

  const messageId = duelState.messageID.toString(); // Assure-toi que c'est une string
  try {
    // Essaye de fetch le message précis
    let messageTrouve = null;
    if (messageId !== "") {
      messageTrouve = await channel.messages.fetch(messageId);
    }
    if (!messageTrouve) {
      const message = await channel.send({ embeds: [embed] });
      duelState.messageID = message.id;
    } else {
      await messageTrouve.edit({ embeds: [embed] });
    }
  } catch (err) {}
}

async function deleteHistoryMessage() {
  const messageId = duelState.messageID.toString(); // Assure-toi que c'est une string
  try {
    // Essaye de fetch le message précis
    const messageTrouve = await channel.messages.fetch(messageId);
    if (messageTrouve) {
      await messageTrouve.delete().catch(() => {});
    }
  } catch (err) {}
}

module.exports = { createOrUpdateHistoryMessage, deleteHistoryMessage };
