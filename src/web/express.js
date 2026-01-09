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

app.get("/export/db", (req, res) => {
  if (req.query.key !== process.env.EXPORT_KEY) {
    return res.sendStatus(403);
  }

  res.download(process.env.DB_PATH, `scores-${Date.now()}.db`);
});

// Démarre le serveur
app.listen(PORT, () => console.log(`✅ Leaderboard accessible sur http://localhost:${PORT}/leaderboard`));

module.exports = app;
