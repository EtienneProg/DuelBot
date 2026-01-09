const {
} = require("discord.js");
const { handleCollectors } = require("./inscription.collectors");
const {buildInscriptionButtons, buildInscriptionEmbed, createInscription} = require("./inscription.service");
const db = require("../database/sqlite");

async function Inscription(client, date) {
    const channel = await client.channels.fetch(process.env.INSCRIPTION_DUEL_CHANNEL_ID);
    const embed = buildInscriptionEmbed(date);
    const components = [buildInscriptionButtons()];

    const msg = await channel.send({
        embeds: [embed],
        components
    });

    await createInscription(date, msg.id)

    await handleCollectors(msg, channel);
}

async function recupereInscription(client) {
    const channel = await client.channels.fetch(process.env.INSCRIPTION_DUEL_CHANNEL_ID);

    db.all("SELECT * FROM inscriptions", async (err, rows) => {
        if (err) return console.error("Erreur récupération inscriptions:", err);

        for (const row of rows) {
            const messageId = row.idMessage.toString(); // Assure-toi que c'est une string
            try {
                // Essaye de fetch le message précis
                const message = await channel.messages.fetch(messageId);

                if (!message) {
                    // Message introuvable → suppression de l'inscription
                    console.warn(`Message ${messageId} introuvable, suppression de l'inscription en BDD`);
                    db.run("DELETE FROM inscriptions WHERE idMessage = ?", [messageId]);
                    continue;
                }

                // Message trouvé → on crée le collector
                if (row.status === "EN_COURS") {
                    handleCollectors(message, channel);
                } else {
                    // Juste s'assurer que les boutons ont disparu
                    await message.edit({ components: [] });
                }
                console.log(`Collector attaché au message ${messageId}`);
            } catch (e) {
                // Si erreur fetch (message supprimé, permissions, etc.)
                console.warn(`Impossible de récupérer le message ${messageId}:`, e.message);
                db.run("DELETE FROM inscriptions WHERE idMessage = ?", [messageId], err => {
                    if (err) console.error("Erreur suppression inscription :", err);
                });
            }
        }
    });
}




module.exports = { Inscription , recupereInscription};
