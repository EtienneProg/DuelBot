const pubComponent = `
<div class="h-1/3 w-full max-[1567px]:h-auto">
        <div class="relative w-full h-full rounded-3xl bg-[#1b0f2f]/90 backdrop-blur-xl 
              p-6 neon-frame flex flex-col justify-between items-center text-center">

          <!-- Decorative corners -->
          <span class="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-cyan-400"></span>
          <span class="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-cyan-400"></span>
          <span class="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-cyan-400"></span>
          <span class="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-cyan-400"></span>

          <!-- Title -->
          <h3 class="text-white text-2xl font-extrabold tracking-widest 
                    drop-shadow-[0_0_10px_#22d3ee]">
            🔥 REJOINS LA COMMUNAUTÉ 🔥
          </h3>

          <div class="flex max-[683px]:flex-col h-full w-full justify-center items-center p-2 gap-2">

          

          <!-- QR CODE -->
          <div class="relative h-[80%] max-[1200px]:h-60 aspect-square p-1 rounded-2xl bg-black/40 
                      border-2 border-purple-400 shadow-[0_0_20px_#a855f7] flex justify-center items-center">
            

            <span class=" w-full h-full bg-[url(/images/QR-Invitation.png)] bg-cover bg-center"></span>
          </div>

          <!-- Hook sentences -->
          <div class="flex flex-col gap-6 text-sm leading-tight">
            <p class="text-cyan-300 font-bold text-lg">
             ⚔️ Pour participer aux duels ⚔️
            </p>
            <div class="text-green-400 font-extrabold tracking-widest text-xl 
                        drop-shadow-[0_0_10px_#22c55e] animate-pulse">
              SCANNE & REJOINS
            </div>
            <p class="text-pink-400 font-extrabold tracking-wide uppercase text-s px-10">
            Uniquement pendant le Laser Game illimité
            </p>            
          </div>
          </div>
        </div>
      </div>
`

module.exports = {pubComponent}
