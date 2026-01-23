const header = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Leaderboard TV</title>
  <meta http-equiv="refresh" content="60">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&display=swap" rel="stylesheet">

  <style>
    body { font-family: 'Orbitron', sans-serif; }

    .neon-frame {
      box-shadow:
        0 0 20px rgba(168,85,247,.6),
        inset 0 0 20px rgba(168,85,247,.3);
    }

    .gold   { box-shadow: 0 0 20px #facc15; }
    .silver { box-shadow: 0 0 18px #e5e7eb; }
    .bronze { box-shadow: 0 0 18px #fb923c; }

    .standard {
      box-shadow: 0 0 10px rgba(34,211,238,.35);
    }

    .empty {
      opacity: .35;
      border-style: dashed;
    }
  </style>
</head>

<body class="h-screen min-[1568px]:overflow-hidden max-[1567px]:h-max bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 flex items-center justify-center">

  <div class="p-8 max-[428px]:px-2 w-screen h-screen max-[1567px]:h-max box-border bg-[url('https://lh3.googleusercontent.com/p/AF1QipPoJU8K0BIfOFuiSwLFmnAH_nyq0xHyh6v8hiXS=s1360-w1360-h1020-rw')] bg-cover bg-center">
  <div class="flex max-[1567px]:flex-col h-full w-full gap-10">
`

const footer = `
</div>
</div>

 

</body>

</html>

`

module.exports = {header, footer}

