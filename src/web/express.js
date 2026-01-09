const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const {getSite} = require("./site/site.service");

app.use(express.static(path.join(__dirname, '../../public')));

app.get('/leaderboard', async (req, res) => {
    let html = await getSite()
    res.send(html);
});

// Démarre le serveur
app.listen(PORT, () => console.log(`✅ Leaderboard accessible sur http://localhost:${PORT}/leaderboard`));

module.exports = app;
