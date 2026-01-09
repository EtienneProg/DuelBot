const duelPlayerComponentT1 = (player, duelEnCours) => `
<div class="flex items-center max-[545px]:justify-center gap-3 h-full">
           <div class="h-[90%] max-h-[100px] max-[643px]:hidden aspect-square rounded-full bg-[url('${player.avatar}')] bg-cover border-2 border-${duelEnCours ? "cyan-400" : (player.win ? "green-400":"red-600")}"></div>
           <span class="text-${duelEnCours ? "white" : (player.win ? "green-400":"red-600")} font-bold ${duelEnCours ? "text-lg" : "text-xl"}">${player.username}</span>
</div>
`
const duelPlayerComponentT2 = (player, duelEnCours) => `
<div class="flex items-center max-[545px]:justify-center gap-3 h-full">
           <span class="text-${duelEnCours ? "white" : (player.win ? "green-400":"red-600")} font-bold ${duelEnCours ? "text-lg" : "text-xl"} text-right">${player.username}</span>
           <div class="h-[90%] max-h-[100px] max-[643px]:hidden aspect-square rounded-full bg-[url('${player.avatar}')] bg-cover border-2 border-${duelEnCours ? "cyan-400" : (player.win ? "green-400":"red-600")}"></div>
</div>
`
module.exports = {duelPlayerComponentT1, duelPlayerComponentT2}
