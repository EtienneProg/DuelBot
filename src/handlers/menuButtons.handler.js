const fs = require("fs");
const path = require("path");

module.exports = (client) => {

    client.menuButtons = new Map();

    const buttonsPath = path.join(__dirname, "..", "menu");
    const buttonFiles = fs.readdirSync(buttonsPath).filter(f => f.endsWith(".js"));

    for (const file of buttonFiles) {
        const button = require(path.join(buttonsPath, file));

        if (!button.customId || !button.execute || !button.label) {
            console.warn(`⚠️ Bouton invalide : ${file}`);
            continue;
        }

        client.menuButtons.set(button.customId, button);
    }

    console.log(`✅ ${client.menuButtons.size} boutons chargés`);
};
