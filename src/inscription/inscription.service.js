const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const db = require("../database/sqlite");

const STATUS_LABELS = {
    EN_COURS: "🟢 En cours",
    TERMINE: "🔵 Terminé",
};


async function createInscription(date, idMessage) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO inscriptions (date, idMessage, users_ids)
             VALUES (?, ?, ?)`,
            [date, idMessage, JSON.stringify([])],
            err => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}


function buildInscriptionEmbed(date) {
    return new EmbedBuilder()
        .setColor(0x00fff7) // néon cyan
        .setTitle("⚔️  Inscriptions duels  ⚔️")
        .setDescription(
            `\n\n📅  **${date}**\n\n` +
            `💡 Rejoins l’arène, prouve ta valeur et grimpe le classement.\n`
        ).addFields(
        {
            name: "👥 Joueurs inscrits",
            value: "Aucun inscrit pour le moment.\n",
            inline: false
        })
        .setFooter({ text: STATUS_LABELS.EN_COURS })
        .setTimestamp();
}

function buildInscriptionButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("INSCRIPTION_JOIN")
            .setLabel("🎮 S'inscrire")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("INSCRIPTION_LEAVE")
            .setLabel("❌ Se désinscrire")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("INSCRIPTION_ACTIVATE")
            .setLabel("⚡ Activer")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("INSCRIPTION_FINISH")
            .setLabel("🏁")
            .setStyle(ButtonStyle.Danger)
    );
}

function buildUpdatedEmbed(baseEmbed, members, status = "EN_COURS", isActive = false) {
    const embed = EmbedBuilder.from(baseEmbed);

    const statusLabel = STATUS_LABELS[status] ?? status;

    embed.spliceFields(0, embed.data.fields?.length ?? 0);
    if (members.length === 0) {
        embed.addFields(
            {
            name: "👥 Joueurs inscrits",
            value: "Aucun inscrit pour le moment.\n",
            inline: false
        });
    } else {
        embed.addFields(
            {
            name: `👥 Joueurs inscrits (${members.length})`,
            value: members.map(m => `• <@${m}>`).join("\n") +"\n",
            inline: false
        });
    }

    embed.setFooter(getFooter(status, isActive))

    return embed;
}

function getFooter(status, isActive) {
    let text = STATUS_LABELS[status];
    if (isActive) text += " • ⚡ ACTIVE";
    return { text };
}


module.exports = { buildInscriptionEmbed, buildInscriptionButtons, buildUpdatedEmbed, createInscription };
