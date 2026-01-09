const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const duelState = require("./duel.state");
const db = require("../database/sqlite");
const { updateElo } = require("../database/elo.service");
const { updateMenuMessage } = require("../utils/menuUpdater");
const {createDuelInDb, finishDuel, deleteDuel, getActiveInscriptionMembers} = require("./duel.service");
const {createOrUpdateHistoryMessage} = require("./duel.history");

async function handleCollectors(message, channel) {

    const collector = message.createMessageComponentCollector();

    collector.on("collect", async interaction => {
        await interaction.deferUpdate();

        // ❌ Annulation globale
        if (interaction.customId === "DUEL_CANCEL") {
            await deleteDuel()
            return endDuel(channel);
        }

        // 1️⃣ Taille équipe
        if (interaction.customId.startsWith("DUEL_SIZE_")) {
            duelState.teamSize = Number(interaction.customId.split("_")[2]);

            await message.delete().catch(() => {});
            return askTeam(channel, 1);
        }


        // Sélection Team 1
        if (interaction.customId === "TEAM1_SELECT") {
            duelState.team1 = interaction.values;
            await message.delete();
            return askTeam(channel, 2);
        }

        // Sélection Team 2
        if (interaction.customId === "TEAM2_SELECT") {
            duelState.team2 = interaction.values;

            duelState.duelId = await createDuelInDb(
                duelState.team1,
                duelState.team2
            );

            await createOrUpdateHistoryMessage(channel.client, { status: "ONGOING" });

            await message.delete();
            return askWinner(channel);
        }

        // Résultat
        if (interaction.customId.startsWith("WIN_TEAM_")) {
            const winnerTeam = interaction.customId.endsWith("1") ? 1 : 2;
            await processResult(winnerTeam, channel);
        }
    });
}

async function askTeam(channel, teamNumber) {
    const players = await getActiveInscriptionMembers(channel.guild);

    const excluded = teamNumber === 2 ? duelState.team1 : [];
    const members = players.filter(m => !excluded.includes(m.id));

    if (members.length < duelState.teamSize) {
        const msgErr = await channel.send("Pas assez de membre pour faire ce duel !");
        setTimeout(() => {
            msgErr.delete().catch(() => {});
        }, 2000);
        return endDuel(channel)
    }
    const select = new StringSelectMenuBuilder()
        .setCustomId(`TEAM${teamNumber}_SELECT`)
        .setMinValues(duelState.teamSize)
        .setMaxValues(duelState.teamSize)
        .addOptions(members.map(m => ({
            label: m.displayName,
            value: m.id
        })));

    const cancel = new ButtonBuilder()
        .setCustomId("DUEL_CANCEL")
        .setLabel("Annuler")
        .setStyle(ButtonStyle.Danger);

    const msg = await channel.send({
        content: `👥 Sélection équipe ${teamNumber}`,
        components: [
            new ActionRowBuilder().addComponents(select),
            new ActionRowBuilder().addComponents(cancel)
        ]
    });

    duelState.messages.push(msg);
    handleCollectors(msg, channel);
}

async function processResult(winnerTeam, channel) {
    const winners = winnerTeam === 1 ? duelState.team1 : duelState.team2;
    const losers = winnerTeam === 1 ? duelState.team2 : duelState.team1;

    await createOrUpdateHistoryMessage(channel.client, {status: "FINISHED", winnerTeam: winnerTeam});
    await finishDuel(winnerTeam);

    let winnersElo = await getAverageElo(winners)
    let losersElo = await getAverageElo(losers)

    winners.forEach(async (id) => {

        const elo = await getAverageElo([id])

        const [newElo, _] = updateElo(elo, losersElo)

        db.run(
            `UPDATE users
             SET score = ?,
                 nb_win = nb_win + 1,
                 last_match = ?,
                 last_match_win = ?
             WHERE user_id = ?`,
            [newElo, `${losers.map(m => channel.guild.members.cache.get(m).displayName).join(", ")}`, 1, id]
        );
    })

    losers.forEach(async (id) => {

        const elo = await getAverageElo([id])

        const [_, newElo] = updateElo(winnersElo, elo)

        db.run(
            `UPDATE users
             SET score = ?,
                 nb_lose = nb_lose + 1,
                 last_match = ?,
                 last_match_win = ?
             WHERE user_id = ?`,
            [newElo, `${winners.map(m => channel.guild.members.cache.get(m).displayName).join(", ")}`, 0, id]
        );
    })


    const winnerNames = winners
        .map(id => {
            const m = channel.guild.members.cache.get(id);
            return m ? m.toString() : "???";
        })
        .join(", ");

    channel.send(`🏆 **Victoire de :** ${winnerNames}`);
    endDuel(channel);
}


async function askWinner(channel) {

    const formatTeam = (ids, label) =>
        `**${label}**\n` +
        ids.map(id => {
            const m = channel.guild.members.cache.get(id);
            return `• ${m?.displayName || "?"}`;
        }).join("\n");

    const content = `
🏆 **Quel est le vainqueur ?**

${formatTeam(duelState.team1, "Équipe 1")}
${formatTeam(duelState.team2, "Équipe 2")}
`;

    const msg = await channel.send({
        content,
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("WIN_TEAM_1")
                    .setLabel("Victoire Équipe 1")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("WIN_TEAM_2")
                    .setLabel("Victoire Équipe 2")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("DUEL_CANCEL")
                    .setLabel("Annuler")
                    .setStyle(ButtonStyle.Danger)
            )
        ]
    });

    duelState.messages.push(msg);
    handleCollectors(msg, channel);
}


function endDuel(channel) {
    duelState.active = false;
    duelState.duelId = null;
    duelState.teamSize = 0;
    duelState.team1 = [];
    duelState.team2 = [];

    duelState.messages.forEach(m => m.delete().catch(()=>{}));
    duelState.messages = [];

    updateMenuMessage(channel.client);
}

async function getAverageElo(userIds) {
    if (!userIds.length) return 1000;

    const placeholders = userIds.map(() => "?").join(",");

    return new Promise((resolve, reject) => {
        db.all(
            `SELECT user_id, score
             FROM users
             WHERE user_id IN (${placeholders})`,
            userIds,
            (err, rows) => {
                if (err) return reject(err);

                const scoreMap = new Map(
                    rows.map(r => [r.user_id, r.score])
                );

                let total = 0;

                for (const id of userIds) {
                    total += scoreMap.get(id) ?? 1000;
                }

                const average = Math.round(total / userIds.length);
                resolve(average);
            }
        );
    });
}




module.exports = { handleCollectors, askWinner };
