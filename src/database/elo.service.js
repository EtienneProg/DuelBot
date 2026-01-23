function updateElo(winnerElo, loserElo, nbMatch, K = 10) {
  const kWiner = getK(nbMatch);

  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

  return [
    Math.round(winnerElo + kWiner * (1 - expectedWinner + 1)),
    Math.round(loserElo + K * (0 - expectedLoser)),
  ];
}

function getK(nbMatch) {
  if (nbMatch < 10) return 60;
  if (nbMatch < 20) return 50;
  if (nbMatch < 30) return 40;
  return 32;
}

module.exports = { updateElo };
