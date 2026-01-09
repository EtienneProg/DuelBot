const duelHistoryHeader = `
<div class="flex flex-col max-[1567px]:flex-row max-[1200px]:flex-col max-[1567px]:w-full w-1/3 h-full gap-6">
      <!-- DUELS PANEL -->
      <div class="relative w-full h-2/3 max-[1567px]:h-full rounded-3xl bg-[#1b0f2f]/90 backdrop-blur-xl px-6 py-6 neon-frame flex flex-col">

        <!-- Decorative corners -->
        <span class="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-cyan-400"></span>
        <span class="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-cyan-400"></span>
        <span class="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-cyan-400"></span>
        <span class="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-cyan-400"></span>

        <!-- TITLE -->
        <h2 class="text-center text-4xl text-white font-extrabold tracking-widest drop-shadow-[0_0_15px_#22d3ee] mb-6">
          ⚔️ DUELS ⚔️
        </h2>

        <!-- CONTENT -->
        <div class="flex flex-col gap-2 h-full px-2 pb-2">
`

const duelHistoryFooter = `
</div>
</div>
`

module.exports = {duelHistoryHeader, duelHistoryFooter}
