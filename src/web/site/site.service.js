const {footer, header} = require("./base")
const {getDuelHistory, getLeaderboard, getPub} = require("./component")

async function getSite(){
    let site = header
    site += await getLeaderboard()
    site += await getDuelHistory()
    site += getPub()
    site += footer
    return site
}

module.exports = {getSite}
