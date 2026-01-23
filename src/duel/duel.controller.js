const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const duelState = require("./duel.state");
const { handleCollectors, askWinner} = require("./duel.collectors");
const {getDuelEnCours} = require("../database/duels/duels.database");
const {updateMenuMessage} = require("../utils/menuUpdater");

async function startDuel(channel) {

    const buttons = new ActionRowBuilder().addComponents(
        [1,2,3,4,5].map(n =>
            new ButtonBuilder()
                .setCustomId(`DUEL_SIZE_${n}`)
                .setLabel(`${n}`)
                .setStyle(ButtonStyle.Primary)
        )
    );

    const cancel = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("DUEL_CANCEL")
            .setLabel("Annuler")
            .setStyle(ButtonStyle.Danger)
    );

    const msg = await channel.send({
        content: "⚔️ Combien de joueurs par équipe ?",
        components: [buttons, cancel]
    });

    duelState.messages.push(msg);
    handleCollectors(msg, channel);
}

async function recupereDuel(client) {
    const duel = await getDuelEnCours()
    if (!duel) return;
    duelState.active= true;
    duelState.teamSize = 0;
    duelState.team1 = JSON.parse(duel.team1_ids);
    duelState.team2 = JSON.parse(duel.team2_ids);
    duelState.duelID =duel.id;
    duelState.messageID = duel.id_message;

    const channel = await client.channels.fetch(process.env.ALLOWED_CHANNEL_ID);
    await updateMenuMessage(client);
    await askWinner(channel)
}


module.exports = { startDuel, recupereDuel };
