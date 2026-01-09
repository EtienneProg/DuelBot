const {getRecentDuels} = require("../../../../database/duels/duels.database");
const {duelHistoryFooter, duelHistoryHeader} = require("./duel-history.base");
const {duelComponent} = require("./duel");

async function getDuelHistory(){
    const duels = await getRecentDuels()

    let duelsComponent = duelHistoryHeader

    duels.forEach(duel => {
        duelsComponent += duelComponent(duel)
    })

    duelsComponent += duelHistoryFooter

    return duelsComponent
}

module.exports = {getDuelHistory}
