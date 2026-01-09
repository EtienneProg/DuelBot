const {buildUpdatedEmbed} = require("./inscription.service");
const db = require("../database/sqlite");
const {upsertUserFromMember} = require("../database/users/user.database");


async function handleCollectors(message, channel) {

    const allowedRoles = process.env.INSCRIPTION_ADMIN_ROLES?.split(",") ?? [];
    const collector = message.createMessageComponentCollector();

    collector.on("collect", async interaction => {
        await interaction.deferUpdate();

        const memberId = interaction.user.id;

        // Récupère l'inscription en BDD
        db.get("SELECT * FROM inscriptions WHERE idMessage = ?", [message.id], async (err, row) => {
            if (err || !row) return console.error(err || "Inscription introuvable");

            // Parse la liste des inscrits
            let users = [];
            try {
                users = JSON.parse(row.users_ids);
            } catch (e) {
                users = [];
            }

            // 🎮 INSCRIPTION
            if (interaction.customId === "INSCRIPTION_JOIN") {
                if (!users.includes(memberId)) {
                    users.push(memberId);

                    await upsertUserFromMember(interaction.member);
                }
            }

            // ❌ DESINSCRIPTION
            if (interaction.customId === "INSCRIPTION_LEAVE") {
                users = users.filter(id => id !== memberId);
            }

            if (interaction.customId === "INSCRIPTION_ACTIVATE") {

                const isAllowed = interaction.member.roles.cache
                    .some(r => allowedRoles.includes(r.id));
                if (!isAllowed) return;

                // 1️⃣ Désactive toutes les inscriptions
                db.run("UPDATE inscriptions SET is_active = 0");

                // 2️⃣ Active celle-ci
                db.run(
                    "UPDATE inscriptions SET is_active = 1 WHERE idMessage = ?",
                    [message.id]
                );

                // 3️⃣ Mise à jour embed
                const updatedEmbed = buildUpdatedEmbed(
                    message.embeds[0],
                    users,
                    row.status,
                    true // active
                );

                await message.edit({ embeds: [updatedEmbed] });

                return;
            }


            // 🏁 Finish (STAFF)
            if (interaction.customId === "INSCRIPTION_FINISH") {
                if (row.status !== "EN_COURS") return;
                const isAllowed = interaction.member.roles.cache
                    .some(r => allowedRoles.includes(r.id));
                if (!isAllowed) return;

                const status = "TERMINE";

                db.run(
                    "UPDATE inscriptions SET status = ?, is_active = ? WHERE idMessage = ?",
                    [status, 0, message.id]
                );

                const updatedEmbed = buildUpdatedEmbed(message.embeds[0], users, status);

                await message.edit({
                    embeds: [updatedEmbed],
                    components: [] // ⛔ boutons supprimés
                });

                collector.stop("cancelled");
                return;
            }

            // Met à jour la BDD
            db.run("UPDATE inscriptions SET users_ids = ? WHERE idMessage = ?", [JSON.stringify(users), message.id], async err => {
                if (err) return console.error(err);

                // 🔄 UPDATE EMBED
                const updatedEmbed = buildUpdatedEmbed(message.embeds[0], users, row.status, row.is_active);
                await message.edit({embeds: [updatedEmbed]});
            });
        });

    });
}

module.exports = { handleCollectors };
