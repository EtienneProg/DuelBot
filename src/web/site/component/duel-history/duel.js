const { duelPlayerComponentT1, duelPlayerComponentT2 } = require('./duel-player');

const duelComponent = (data) => `
<div class="relative h-${data.slot}/6 grid min-[546px]:grid-cols-[1fr_auto_1fr] max-[545px]:grid-rows-[1fr_auto_1fr] bg-[#2a1747] items-center w-full rounded-2xl px-4 py-2 ${data.duelEnCours ? '' : 'border border-green-400/70'}">
    ${data.duelEnCours ? '<div class="absolute inset-0 rounded-2xl animate-pulse pointer-events-none border-2 border-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>' : ''}
      
    <div class="min-[546px]:justify-self-start h-full flex flex-col py-1">
    ${data.team1.map((player) => duelPlayerComponentT1(player, data.duelEnCours)).join('')}
    </div>
    <span class="text-purple-300 justify-self-center ${data.duelEnCours ? 'font-extrabold text-2xl drop-shadow-[0_0_10px_#a855f7]' : 'text-bold'}">
       VS
    </span>
    <div class="min-[546px]:items-end h-full flex flex-col py-1">
        ${data.team2.map((player) => duelPlayerComponentT2(player, data.duelEnCours)).join('')}
    </div>
</div>
`;

/*
const data = {
    duelEnCours : true,
    team1 : [{username : "CyberG", avatar : "https://i.pravatar.cc/100?img=2", win: false}],
    team2 : [{username : "CyberG", avatar : "https://i.pravatar.cc/100?img=2", win : false}],
    estTeam : false
}
*/

module.exports = { duelComponent };
