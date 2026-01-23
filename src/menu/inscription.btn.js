const {
  ButtonStyle,
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  customId: "INSCRIPTIONBTN",
  label: "Inscription",
  style: ButtonStyle.Primary,
  order: 2,

  isDisabled() {
    return false;
  },

  async execute(interaction, _) {
    // Création du modal
    const modal = new ModalBuilder()
      .setCustomId("INSCRIPTION_MODAL")
      .setTitle("Inscription au duel")
      .setComponents([
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("INSCRIPTION_JOUR")
            .setLabel("Jour (1-31)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Ex: 15")
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("INSCRIPTION_MOIS")
            .setLabel("Mois (1-12)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Ex: 7")
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("INSCRIPTION_ANNEE")
            .setLabel("Année (ex: 2026)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Ex: 2026")
            .setRequired(true)
            .setValue("2026")
        ),
      ]);

    await interaction.showModal(modal);
  },
};
