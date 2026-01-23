const leaderboardheader = `
<div class="w-2/3 h-full max-[1567px]:w-full max-[1567px]:h-max">
       <!-- MAIN CONTAINER -->
      <div class="relative w-full h-full max-[1567px]:h-max rounded-3xl bg-[#1b0f2f]/90 backdrop-blur-xl px-10 max-[492px]:px-2 py-6 neon-frame flex flex-col">

        <!-- Decorative corners -->
        <span class="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-purple-400"></span>
        <span class="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-purple-400"></span>
        <span class="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-purple-400"></span>
        <span class="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-purple-400"></span>

        <!-- TITLE -->
        <h1 class="h-max py-2 text-center flex justify-center items-center text-5xl max-[1567px]:text-4xl max-[405px]:text-2xl text-white font-extrabold tracking-widest drop-shadow-[0_0_15px_#a855f7]">
          TOP 10 LEADERBOARD
        </h1>

        <!-- LEADERBOARD GRID -->
        <div class="h-full w-full bg-[url(/images/logo-game-center-la-turbine.png)] bg-center bg-no-repeat bg-[length:60%]">
          <table class="w-full h-full border-separate border-spacing-y-[1vh]">
            <tbody>
`

const leaderboardfooter = `
            </tbody>
          </table>
        </div>


      </div>

  </div>
`

module.exports = {leaderboardheader, leaderboardfooter}
