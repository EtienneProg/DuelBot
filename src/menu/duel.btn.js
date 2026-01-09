const { ButtonStyle } = require("discord.js");
const duelState = require("../duel/duel.state");
const { startDuel } = require("../duel/duel.controller");
const { updateMenuMessage } = require("../utils/menuUpdater");

module.exports = {
    customId: "DUELBTN",
    label: "Duel",
    style: ButtonStyle.Primary,
    order: 1,

    isDisabled() {
        return duelState.active;
    },

    async execute(interaction, client) {

        if (duelState.active) {
            return interaction.reply({
                content: "❌ Un duel est déjà en cours.",
                ephemeral: true
            });
        }

        duelState.active = true;
        await updateMenuMessage(client);
        await startDuel(interaction.channel, client);
    }
};
