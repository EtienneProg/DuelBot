const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function buildMenuButtons(client) {

    const buttons = [...client.menuButtons.values()]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(btn => {

            const builder = new ButtonBuilder()
                .setCustomId(btn.customId)
                .setLabel(btn.label)
                .setStyle(btn.style);

            if (typeof btn.isDisabled === "function" && btn.isDisabled()) {
                builder.setDisabled(true);
            }

            return builder;
        });

    const rows = [];
    while (buttons.length) {
        rows.push(new ActionRowBuilder().addComponents(buttons.splice(0, 5)));
    }

    return rows;
}

module.exports = { buildMenuButtons };
