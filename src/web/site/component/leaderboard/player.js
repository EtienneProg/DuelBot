/*
const date = {
    score : "40 000",
    color: "yellow", // yellow | cyan | gray | orange
    lastMatchIcon : "❌", // ❌ | 🏆
    lastMatch : "5 vs 5", // nombre de joueurs ou nom du joueur si 1V1
    victory: 5,
    lost: 2,
    level: "Bronze",
    username: "CyberG",
    avatar:"https://i.pravatar.cc/100?img=2",
    rank: 1
}
*/

const playerComponent = (data) => `
    <tr class="bg-[#2a1747]/75 rounded-2xl ${data.rankStyle}">
        <!-- RANK -->
        <td class="w-[60px] text-center text-${data.color}-400 text-3xl font-bold py-2 rounded-l-2xl">
           ${data.rank}
        </td>

        <!-- PLAYER -->
        <td class="py-2">
            <div class="flex items-center gap-4">
                <span class="h-14 aspect-square rounded-full border-4 border-${data.color}-400 bg-[url(${data.avatar ? "'" + data.avatar + "'" : "/images/user.png"})] bg-cover bg-center"></span>
                <div class="flex flex-col">
                    <span class="text-white text-2xl font-bold inline-block max-w-[250px] truncate whitespace-nowrap">
                        ${data.username}
                    </span>
                </div>
            </div>
        </td>

        <td class="py-2 w-auto px-2">
            <div class="flex justify-center text-yellow-400 text-lg whitespace-nowrap">${data.level}</div>
        </td>

        <!-- STATS -->
        <td class="py-2 px-2">
             <div class="flex gap-3 text-sm">
                 <span class="px-3 py-1 rounded-full bg-green-500/20 text-green-400 whitespace-nowrap">🏆 ${data.victory}</span>
                 <span class="px-3 py-1 rounded-full bg-red-500/20 text-red-400 whitespace-nowrap">❌ ${data.lost}</span>
                 <span class="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 flex justify-center items-center gap-2">
                     <span>⏱</span>
                     <span class="inline-block max-w-[150px] truncate whitespace-nowrap overflow-hidden">${data.lastMatch}</span>             
                     <span>${data.lastMatchIcon}</span>                        
                 </span>
             </div>
        </td>

        <!-- SCORE -->
        <td class="w-min text-right text-${data.color}-300 text-4xl font-extrabold py-2 rounded-r-2xl pr-6 whitespace-nowrap">
            ${data.score}
        </td>
    </tr>
`

const playerEmptyComponent = (rank) => `
<tr class="bg-[#2a1747] rounded-2xl border border-cyan-400/70 empty">
                <td class="w-[60px] text-center text-cyan-300 text-2xl font-bold py-2 rounded-l-2xl">
                  ${rank}
                </td>

                <td class="py-2">
                  <div class="flex items-center gap-4">
                    <span class="h-14 aspect-square rounded-full border-2 border-cyan-400/70"></span>
                    <span class="italic text-purple-300">— emplacement libre —</span>
                  </div>
                </td>
                <td></td>
                <td></td>

                <td class="w-[160px] text-right text-purple-400 text-3xl font-bold py-2 rounded-r-2xl pr-6">
                  —
                </td>
              </tr>
`

module.exports = { playerComponent, playerEmptyComponent}
