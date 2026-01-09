const inscriptionState = require("./inscription.state");
const { Inscription } = require("./inscription.controller");
const {updateMenuMessage} = require("../utils/menuUpdater");

async function handleInscriptionModal(interaction, client) {

    const jour  = interaction.fields.getTextInputValue("INSCRIPTION_JOUR");
    const mois  = interaction.fields.getTextInputValue("INSCRIPTION_MOIS");
    const annee = interaction.fields.getTextInputValue("INSCRIPTION_ANNEE");

    const j = Number(jour);
    const m = Number(mois);
    const a = Number(annee);

    if (
        isNaN(j) || isNaN(m) || isNaN(a) ||
        j < 1 || j > 31 ||
        m < 1 || m > 12 ||
        a < 2026
    ) {
        const msg = interaction.channel.send({
            content: "Inscription : ❌ Date invalide."
        });
        setTimeout(() => {
            msg.delete().catch(() => {});
        }, 2000);
    }else{

        const date = `${String(j).padStart(2, "0")}/${String(m).padStart(2, "0")}/${a}`;
        await Inscription(client, date);
    }

    inscriptionState.active = false;
    await updateMenuMessage(client);
}

module.exports = { handleInscriptionModal };
