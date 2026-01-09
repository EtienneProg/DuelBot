require("dotenv").config();
require('./web/express'); // importe et lance le serveur Express
const { Client, GatewayIntentBits, ComponentType } = require("discord.js");
const menuHandler = require("./handlers/menuButtons.handler");
const { buildMenuButtons } = require("./utils/menuBuilder");
const {recupereInscription} = require("./inscription/inscription.controller");
const {handleInscriptionModal} = require("./inscription/inscription.modal");
const {recupereDuel} = require("./duel/duel.controller");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

menuHandler(client);

client.once("ready", async () => {
    await refreshMemberCache();

    await initChannel();

    console.log("✅ Bot prêt");
});

client.on("interactionCreate", async interaction => {

    // 🧠 MODAL SUBMIT
    if (interaction.isModalSubmit()) {
        if (interaction.customId === "INSCRIPTION_MODAL") {
            await interaction.deferUpdate();
            return handleInscriptionModal(interaction, client);
        }
    }

});


async function initChannel() {
    const channel = await client.channels.fetch(process.env.ALLOWED_CHANNEL_ID);

    // Clear les messages
    const messages = await channel.messages.fetch({ limit: 100 });
    await channel.bulkDelete(messages);



    // Poster message initial
    client.menuMessage = await channel.send({
        content: "Que voulez-vous faire ?",
        components: buildMenuButtons(client)
    });

    const collector = client.menuMessage.createMessageComponentCollector({
        componentType: ComponentType.Button
    });

    collector.on("collect", async (interaction) => {
        const button = client.menuButtons.get(interaction.customId);
        if (!button) return;

        try {
            // Ne fais deferReply QUE si ce n'est pas le bouton Inscription
            if (interaction.customId !== "INSCRIPTIONBTN") {
                await interaction.deferReply();

            }

            await button.execute(interaction, client);
            if (interaction.customId !== "INSCRIPTIONBTN") {
                if (interaction.deferred) await interaction.deleteReply();
            }
        } catch (err) {
            console.error(err);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: "❌ Erreur pendant le traitement.", ephemeral: true });
            }
        }
    });


    await recupereInscription(client)
    await recupereDuel(client)
}

async function refreshMemberCache() {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return console.log("Guild introuvable");

    try {
        console.log("⏳ Refresh cache des membres...");
        await guild.members.fetch();
        console.log("✅ Cache des membres mis à jour");
    } catch (err) {
        console.error("❌ Erreur lors du fetch des membres :", err);
    }
}

// Toutes les 5 minutes
setInterval(refreshMemberCache, 5 * 60 * 1000);

client.login(process.env.DISCORD_TOKEN);
