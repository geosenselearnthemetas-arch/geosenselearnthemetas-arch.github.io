// Writes index.html (the app's page) and d.html (the same page under a daily
// challenge invitation, where shared results link to). Edit here, then run:
//
//   node _build.js
//
// Text goes in pairs: English in the page, Spanish in data-es (lang.js swaps
// it in on Spanish phones; it may hold <b>).
const fs = require('fs');

const apk = 'https://github.com/geosenselearnthemetas-arch/geosenselearnthemetas-arch.github.io/releases/latest/download/GeoSense.apk';
const site = 'https://geosenselearnthemetas-arch.github.io';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** An element with English inside and Spanish in data-es. */
const t = (tag, en, es, attrs = '') => `<${tag}${attrs ? ' ' + attrs : ''} data-es="${esc(es)}">${en}</${tag}>`;

const android = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22A11.5 11.5 0 0 0 12 8.2c-1.74 0-3.38.37-4.92.94L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>';

const shots = [
  ['Home: the daily challenge, the word of the day and the lessons', 'Inicio: el reto diario, la palabra del día y las lecciones'],
  ['Find the country on the map', 'Encuentra el país en el mapa'],
  ['Which writing is on the sign?', '¿Qué escritura hay en la señal?'],
  ['The capital, pinned on the map', 'La capital, marcada en el mapa'],
  ['Which side of the road they drive on', 'Por qué lado se conduce'],
  ['Which continent is it in?', '¿En qué continente está?'],
  ['Your result, ready to share', 'Tu resultado, listo para compartir'],
];

const features = [
  ['Flags', 'Banderas'], ['Capitals', 'Capitales'], ['Alphabets', 'Alfabetos'], ['Driving side', 'Lado de conducción'],
  ['License plates', 'Matrículas'], ['Street View coverage', 'Cobertura de Street View'], ['Web domains', 'Dominios web'],
  ['Phone codes', 'Prefijos'], ['Daily challenge', 'Reto diario'], ['Word of the day', 'Palabra del día'],
];

function page({ daily }) {
  const title = daily ? 'GeoSense daily challenge' : 'GeoSense: Learn the Metas';
  const description = daily
    ? 'Ten geography questions, the same for everyone today. Can you beat my score?'
    : 'Learn the metas: flags, road lines, alphabets, driving side... the clues that tell where a photo was taken. A few minutes a day.';
  const ogDescription = daily ? description : 'Learn the clues that tell where a photo was taken, a few minutes a day.';
  return `<!doctype html>
<!-- Made by _build.js: edit that, not this. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${ogDescription}">
<!-- Small and square: WhatsApp shows it as a thumbnail beside the text, not a big banner. -->
<meta property="og:image" content="${site}/share.png">
<meta property="og:image:width" content="192">
<meta property="og:image:height" content="192">
<meta name="theme-color" content="#0b1324">
<link rel="icon" href="icon.png">
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
${daily ? `  <section class="invite">
    <p class="eyebrow" id="label">Daily challenge</p>
    ${t('h2', 'Can you beat my score?', '¿Me superas?')}
    ${t('p', 'Ten geography questions, the same for everyone today. Install GeoSense and play today’s challenge.', 'Diez preguntas de geografía, las mismas para todos hoy. Instala GeoSense y juega el reto de hoy.')}
  </section>
` : ''}  <header class="app">
    <img class="logo" src="icon.png" alt="" width="76" height="76">
    <div>
      <h1>GeoSense</h1>
      ${t('p', 'Learn the metas', 'Aprende las metas', 'class="by"')}
    </div>
  </header>
  <ul class="facts">
    <li><b data-es="Gratis">Free</b>${t('span', 'price', 'precio')}</li>
    <li><b id="size">25 MB</b>${t('span', 'download', 'descarga')}</li>
    <li><b data-es="Sin anuncios">No ads</b>${t('span', 'ever', 'nunca')}</li>
    <li><b>EN · ES</b>${t('span', 'languages', 'idiomas')}</li>
  </ul>
  <a class="install" href="${apk}">${android}${t('span', 'Download for Android', 'Descargar para Android')}</a>
  ${t('p', 'Android 7.0 or later · no account needed', 'Android 7.0 o superior · sin crear cuenta', 'class="needs"')}

  <!-- store.js picks each image in the page's language. -->
  <div class="shots" id="shots" aria-label="Screenshots">
${shots.map(([en, es], i) => `    <img data-n="${i + 1}" alt="${esc(en)}" data-es-alt="${esc(es)}" width="540" height="1115"${i > 1 ? ' loading="lazy"' : ''}>`).join('\n')}
  </div>

  <section>
    ${t('h3', 'About this app', 'Acerca de esta app')}
    ${t('p', 'On street-level photos, the clues to where you are hide in the details: the letters on the signs, the plates, the side of the road the cars drive on. GeoSense teaches them in short lessons, a few minutes a day, and a daily challenge to play with friends.', 'En las fotos a pie de calle, las pistas de dónde estás se esconden en los detalles: las letras de los carteles, las matrículas, el lado por el que circulan los coches. GeoSense te las enseña con lecciones cortas, unos minutos al día, y un reto diario para jugar con amigos.')}
    <ul class="chips">
${features.map(([en, es]) => `      ${t('li', en, es)}`).join('\n')}
    </ul>
  </section>

  <section>
    ${t('h3', 'What’s new', 'Novedades')}
    <p class="meta" id="release">Version 1.0.0</p>
    <ul class="list">
      ${t('li', 'Review the daily challenge: every miss on a map you can zoom, with why the answer is right.', 'Revisa el reto diario: cada fallo en un mapa que puedes ampliar, con el porqué de la respuesta.')}
      ${t('li', 'New lessons: license plates, web domains and phone codes.', 'Lecciones nuevas: matrículas, dominios web y prefijos telefónicos.')}
      ${t('li', 'Word of the day: a geography word in six tries.', 'Palabra del día: una palabra de geografía en seis intentos.')}
    </ul>
  </section>

  <section>
    ${t('h3', 'Privacy', 'Privacidad')}
    <ul class="privacy">
      <li><span aria-hidden="true">👤</span>${t('span', 'No account and no sign-in.', 'Sin cuenta y sin registro.')}</li>
      <li><span aria-hidden="true">📱</span>${t('span', 'Your progress is saved only on your phone.', 'Tu progreso se guarda solo en tu móvil.')}</li>
      <li><span aria-hidden="true">🚫</span>${t('span', 'No ads and no tracking.', 'Sin anuncios ni rastreo.')}</li>
      <li><span aria-hidden="true">✉️</span>${t('span', 'It only sends something when you report a question: that question and the app’s version.', 'Solo envía algo si reportas una pregunta: esa pregunta y la versión de la app.')}</li>
    </ul>
  </section>

  <details>
    ${t('summary', 'How to install it', 'Cómo instalarla')}
    ${t('p', 'GeoSense is not on Google Play yet, so Android asks a few extra questions the first time. It is safe: say yes to them.', 'GeoSense aún no está en Google Play, así que Android hace alguna pregunta más la primera vez. Es segura: acepta.', 'class="note"')}
    <ol>
      ${t('li', 'Tap <b>Download for Android</b>. If the browser warns that the file could be harmful, tap <b>Download anyway</b>.', 'Pulsa <b>Descargar para Android</b>. Si el navegador avisa de que el archivo puede ser dañino, pulsa <b>Descargar de todos modos</b>.')}
      ${t('li', 'Open <b>GeoSense.apk</b>: from the download notification, or from the <b>Files</b> app, in Downloads.', 'Abre <b>GeoSense.apk</b>: desde el aviso de descarga, o desde la app <b>Archivos</b>, en Descargas.')}
      ${t('li', 'If it says your phone is not allowed to install unknown apps from this source, tap <b>Settings</b>, turn on <b>Allow from this source</b> and go back. This lets your browser (or the Files app) install apps; you can turn it off afterwards.', 'Si dice que tu móvil no puede instalar apps desconocidas de esta fuente, pulsa <b>Ajustes</b>, activa <b>Permitir de esta fuente</b> y vuelve atrás. Así das permiso al navegador (o a la app Archivos) para instalar apps; luego puedes quitarlo.')}
      ${t('li', 'If a security feature of your phone blocks the installation (some brands include an automatic blocker), turn it off for a moment in <b>Settings › Security</b>, install GeoSense and turn it back on.', 'Si alguna protección de seguridad del móvil bloquea la instalación (algunas marcas incluyen un bloqueador automático), desactívala un momento en <b>Ajustes › Seguridad</b>, instala GeoSense y vuelve a activarla.')}
      ${t('li', 'If <b>Google Play Protect</b> says it does not know the app, tap <b>More details</b> and then <b>Install anyway</b>.', 'Si <b>Google Play Protect</b> dice que no conoce la app, pulsa <b>Más detalles</b> y luego <b>Instalar de todos modos</b>.')}
      ${t('li', 'Tap <b>Install</b>, then <b>Open</b>. To update it later, download it again from here and install it over the old one: your progress stays.', 'Pulsa <b>Instalar</b> y luego <b>Abrir</b>. Para actualizarla más adelante, vuelve a descargarla desde aquí e instálala encima: no pierdes tu progreso.')}
    </ol>
  </details>

  ${t('p', 'GeoSense is an independent app, not affiliated with Google. Android is a trademark of Google LLC.', 'GeoSense es una app independiente, sin relación con Google. Android es una marca de Google LLC.', 'class="legal"')}
</main>
<script src="lang.js"></script>
<script src="store.js"></script>
</body>
</html>
`;
}

fs.writeFileSync('index.html', page({ daily: false }));
fs.writeFileSync('d.html', page({ daily: true }));
