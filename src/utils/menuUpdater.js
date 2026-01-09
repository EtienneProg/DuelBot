const { buildMenuButtons } = require("./menuBuilder");

async function updateMenuMessage(client) {
    if (!client.menuMessage) return;

    await client.menuMessage.edit({
        components: buildMenuButtons(client)
    });
}

module.exports = { updateMenuMessage };
