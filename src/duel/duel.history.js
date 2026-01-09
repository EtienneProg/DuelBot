const { EmbedBuilder } = require("discord.js");
const duelState = require("./duel.state");

async function createOrUpdateHistoryMessage(client, options = {}) {
    const channel = await client.channels.fetch(process.env.HISTORIQUE_DUEL_CHANNEL_ID);
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
      embed.setColor(winnerTeam === 1 ? 0x00ff00 : 0xff0000);
    }

    if (!duelState.historyMessage) {
        duelState.historyMessage = await channel.send({embeds: [embed]});
    } else {
        await duelState.historyMessage.edit({ embeds: [embed] });
    }
}

async function deleteHistoryMessage() {
    if (duelState.historyMessage) {
        await duelState.historyMessage.delete().catch(() => {});
        duelState.historyMessage = null;
    }
}

module.exports = { createOrUpdateHistoryMessage, deleteHistoryMessage };
