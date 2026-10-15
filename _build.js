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
  ['A real car with its plate blurred: which country is it?', 'Un coche real con la matrícula difuminada: ¿de qué país es?'],
  ['Which writing is on the sign?', '¿Qué escritura hay en la señal?'],
  ['Missed it? The clue explained: yellow plates with the EU strip', '¿Fallaste? La pista explicada: matrículas amarillas con la franja de la UE'],
  ['Which country’s flag is this?', '¿De qué país es esta bandera?'],
  ['Find the country on the map', 'Encuentra el país en el mapa'],
  ['Your result, ready to share', 'Tu resultado, listo para compartir'],
];

const features = [
  ['Flags', 'Banderas'], ['Capitals', 'Capitales'], ['Alphabets', 'Alfabetos'], ['Driving side', 'Lado de conducción'],
  ['License plates', 'Matrículas'], ['Street View coverage', 'Cobertura de Street View'], ['Web domains', 'Dominios web'],
  ['Phone codes', 'Prefijos'], ['Daily challenge', 'Reto diario'], ['Word of the day', 'Palabra del día'],
];

// The short version, on the app's page; privacy.html has the whole of it.
const privacyPoints = [
  ['👤', 'No account and no sign-in.', 'Sin cuenta y sin registro.'],
  ['📱', 'Your progress is saved only on your phone.', 'Tu progreso se guarda solo en tu móvil.'],
  ['🚫', 'No ads, no analytics and no tracking.', 'Sin anuncios, sin analíticas y sin rastreo.'],
  ['🔔', 'Reminders, if you turn them on, go through our server: an anonymous identifier, your phone’s push address and when to send them.', 'Los recordatorios, si los activas, pasan por nuestro servidor: un identificador anónimo, la dirección push de tu móvil y cuándo enviarlos.'],
  ['✉️', 'When you report an error in a question, it sends that question, your comment and the app’s version.', 'Si notificas un error en una pregunta, envía esa pregunta, tu comentario y la versión de la app.'],
];

const email = 'geosense.learnthemetas@gmail.com';
const mail = `<a href="mailto:${email}">${email}</a>`;

// The privacy policy: sections of [English, Spanish] blocks. A block is a
// paragraph, or a list when it is an array of pairs.
const policy = [
  ['Data controller', 'Responsable del tratamiento', [
    [`GeoSense is a free application, with no advertising and no registration, developed by Damián Delgado, who is the controller of the personal data described in this policy. For any query or request regarding your personal data, please contact ${mail}.`,
     `GeoSense es una aplicación gratuita, sin publicidad y sin registro, desarrollada por Damián Delgado, responsable del tratamiento de los datos personales descritos en esta política. Para cualquier consulta o solicitud relativa a tus datos personales, puedes dirigirte a ${mail}.`],
  ]],
  ['Data stored on your device', 'Datos almacenados en tu dispositivo', [
    ['Your progress, streak, settings and reminder times are stored solely on your device. They are not transmitted to any server and are erased when the application is uninstalled or its data is cleared.',
     'Tu progreso, tu racha, tus ajustes y los horarios de tus recordatorios se almacenan únicamente en tu dispositivo. No se transmiten a ningún servidor y se eliminan al desinstalar la aplicación o borrar sus datos.'],
    ['Data is transmitted outside your device only in the cases described below.',
     'Los datos solo se transmiten fuera de tu dispositivo en los supuestos que se describen a continuación.'],
  ]],
  ['Reminders', 'Recordatorios', [
    ['Android frequently delays alarms from applications that are used infrequently. For this reason, GeoSense delivers its reminders as push notifications. Only if you enable a reminder does the application:',
     'Android retiene con frecuencia las alarmas de las aplicaciones que se usan poco. Por este motivo, GeoSense envía sus recordatorios como notificaciones push. Únicamente si activas un recordatorio, la aplicación:'],
    [
      ['register with our server (Supabase) as an anonymous user, identified by a random identifier, without any name, email address or phone number;',
       'se registra en nuestro servidor (Supabase) como usuario anónimo, mediante un identificador aleatorio, sin nombre, dirección de correo electrónico ni número de teléfono;'],
      ['send it your device’s push address (a Firebase Cloud Messaging token) and the reminders scheduled for the following days, with their time and text.',
       'le envía la dirección push de tu dispositivo (un token de Firebase Cloud Messaging) y los recordatorios previstos para los próximos días, con su hora y su texto.'],
    ],
    ['At the scheduled time, the server sends each reminder through Firebase Cloud Messaging, a service provided by Google. This data is used exclusively to deliver the reminders you have requested. The legal basis for this processing is your consent, given when you enable reminders, which you may withdraw at any time by disabling them in Settings.',
     'A la hora prevista, el servidor envía cada recordatorio a través de Firebase Cloud Messaging, un servicio de Google. Estos datos se utilizan exclusivamente para enviarte los recordatorios que has solicitado. La base jurídica del tratamiento es tu consentimiento, prestado al activar los recordatorios, que puedes retirar en cualquier momento desactivándolos en Ajustes.'],
    ['Each reminder is deleted once it has been sent, and all pending reminders are deleted when you disable them. The push address is deleted after 90 days without the application being opened, or as soon as it ceases to be valid (for example, when the application is uninstalled).',
     'Cada recordatorio se elimina una vez enviado, y todos los pendientes se eliminan al desactivarlos. La dirección push se elimina transcurridos 90 días sin abrir la aplicación, o en cuanto deja de ser válida (por ejemplo, al desinstalarla).'],
    ['Supabase stores this data on servers located in London, United Kingdom, a country recognized by the European Union as providing an adequate level of protection. Google may process it in the United States under the EU-US Data Privacy Framework. On devices without Google Play services, reminders are handled entirely on the device and no data is transmitted.',
     'Supabase almacena estos datos en servidores ubicados en Londres (Reino Unido), país al que la Unión Europea reconoce un nivel de protección adecuado. Google puede tratarlos en Estados Unidos al amparo del Marco de Privacidad de Datos UE-EE. UU. En los dispositivos sin servicios de Google Play, los recordatorios se gestionan íntegramente en el dispositivo y no se transmite ningún dato.'],
  ]],
  ['Question reports', 'Notificación de errores en preguntas', [
    ['When you report a question you consider incorrect, the application sends: the question concerned (its wording, the options, the correct answer and the one you selected), the reason and any comment you provide, the application version, the Android version and device model, the language and certain settings (theme, map and level). This information does not identify you.',
     'Cuando notificas una pregunta que consideras errónea, la aplicación envía: la pregunta en cuestión (su enunciado, las opciones, la respuesta correcta y la que seleccionaste), el motivo y el comentario que añadas, la versión de la aplicación, la versión de Android y el modelo del dispositivo, el idioma y algunos ajustes (tema, mapa y nivel). Esta información no permite identificarte.'],
    ['The report is delivered to GeoSense’s email address through a Google Apps Script service. Should this fail, the application opens your email client instead, in which case the report is sent from your email address, as with any other message. Please do not include personal data in your comments.',
     'El informe se remite a la dirección de correo electrónico de GeoSense mediante un servicio de Google Apps Script. Si este envío falla, la aplicación abre tu cliente de correo, en cuyo caso el informe se envía desde tu dirección de correo electrónico, como cualquier otro mensaje. Te rogamos que no incluyas datos personales en los comentarios.'],
    ['Reports are used solely to correct the question concerned, on the basis of your consent, given by choosing to send them. They are retained until the issue is resolved, and for no longer than one year.',
     'Los informes se utilizan únicamente para corregir la pregunta afectada, sobre la base de tu consentimiento, prestado al decidir enviarlos. Se conservan hasta resolver la incidencia y, como máximo, durante un año.'],
  ]],
  ['Third-party services', 'Servicios de terceros', [
    ['Some questions display Street View imagery, loaded in real time from Google through the Google Maps SDK. In addition, on startup the application obtains a push address for the device from Firebase (Google), even if reminders are never enabled; this address is not sent to our server unless you enable them. In both cases your device connects to Google, which, as with any website, receives your IP address and certain technical data about the device, in accordance with the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>. GeoSense does not receive any of this data.',
     'Algunas preguntas muestran imágenes de Street View, cargadas en tiempo real desde Google mediante el SDK de Google Maps. Además, al iniciarse, la aplicación obtiene de Firebase (Google) una dirección push para el dispositivo, aunque nunca se activen los recordatorios; esta dirección no se envía a nuestro servidor salvo que los actives. En ambos casos, tu dispositivo se conecta a Google, que, como cualquier sitio web, recibe tu dirección IP y determinados datos técnicos del dispositivo, conforme a la <a href="https://policies.google.com/privacy">Política de privacidad de Google</a>. GeoSense no recibe ninguno de estos datos.'],
    ['This website and the application download are hosted on GitHub, which receives data of the same kind when you visit the site or download the application, in accordance with the <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</a>. This website does not use cookies.',
     'Este sitio web y la descarga de la aplicación están alojados en GitHub, que recibe datos de la misma naturaleza cuando visitas el sitio o descargas la aplicación, conforme a la <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">Declaración de privacidad de GitHub</a>. Este sitio web no utiliza cookies.'],
  ]],
  ['Use of data', 'Uso de los datos', [
    ['GeoSense does not display advertising, use analytics tools or build user profiles. Your data is not sold or disclosed to third parties other than the service providers named in this policy, and only for the purposes described herein.',
     'GeoSense no muestra publicidad, no utiliza herramientas de analítica ni elabora perfiles de usuario. Tus datos no se venden ni se ceden a terceros distintos de los proveedores mencionados en esta política, y únicamente para los fines aquí descritos.'],
  ]],
  ['Minors', 'Menores de edad', [
    ['GeoSense is suitable for all ages and does not request any name, email address or account. Users under the age of 14 should obtain the permission of a parent or legal guardian before enabling reminders or sending a report.',
     'GeoSense es apta para todas las edades y no solicita nombre, dirección de correo electrónico ni cuenta. Los usuarios menores de 14 años deben contar con la autorización de sus padres o tutores legales antes de activar los recordatorios o enviar un informe.'],
  ]],
  ['Your rights', 'Tus derechos', [
    [`You may exercise your rights of access, rectification, erasure, restriction of processing, objection and data portability by writing to ${mail}. As reminder data is anonymous, the most direct way to erase it is to disable reminders (which deletes them immediately) and uninstall the application (the push address is then deleted within 90 days).`,
     `Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación del tratamiento, oposición y portabilidad escribiendo a ${mail}. Dado que los datos de los recordatorios son anónimos, la forma más directa de suprimirlos es desactivar los recordatorios (que se eliminan de inmediato) y desinstalar la aplicación (la dirección push se elimina en un plazo de 90 días).`],
    ['If you consider that your data has not been processed lawfully, you may lodge a complaint with the Spanish Data Protection Agency (<a href="https://www.aepd.es">aepd.es</a>) or with the supervisory authority of your country.',
     'Si consideras que tus datos no se han tratado conforme a la normativa, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es">aepd.es</a>) o ante la autoridad de control de tu país.'],
  ]],
  ['Changes to this policy', 'Modificaciones de esta política', [
    ['Any changes to this policy will be published on this page, with the updated date shown at the top.',
     'Cualquier modificación de esta política se publicará en esta página, con la fecha de actualización indicada al inicio.'],
  ]],
];

function privacyPage() {
  const block = (b) => Array.isArray(b[0])
    ? `    <ul class="list">\n${b.map(([en, es]) => `      ${t('li', en, es)}`).join('\n')}\n    </ul>`
    : `    ${t('p', b[0], b[1])}`;
  return `<!doctype html>
<!-- Made by _build.js: edit that, not this. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GeoSense privacy policy</title>
<meta name="description" content="What GeoSense keeps on your phone, what it sends and why.">
<meta name="theme-color" content="#0b1324">
<link rel="icon" href="icon.png">
<link rel="stylesheet" href="style.css">
</head>
<body>
<main class="policy">
  <a class="back" href="./">${t('span', '← GeoSense', '← GeoSense')}</a>
  ${t('h1', 'Privacy policy', 'Política de privacidad')}
  ${t('p', 'Last updated: 15 October 2026', 'Última actualización: 15 de octubre de 2026', 'class="meta"')}
${policy.map(([en, es, blocks]) => `  <section>
    ${t('h3', en, es)}
${blocks.map(block).join('\n')}
  </section>`).join('\n')}
</main>
<script src="lang.js"></script>
</body>
</html>
`;
}

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

  <!-- store.js picks each image in the page's language; the browser picks
       the light or dark one, as the phone is set. -->
  <div class="shots" id="shots" aria-label="Screenshots">
${shots.map(([en, es], i) => `    <picture><source media="(prefers-color-scheme: light)"><img data-n="${i + 1}" alt="${esc(en)}" data-es-alt="${esc(es)}" width="540" height="1115"${i > 1 ? ' loading="lazy"' : ''}></picture>`).join('\n')}
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
${privacyPoints.map(([icon, en, es]) => `      <li><span aria-hidden="true">${icon}</span>${t('span', en, es)}</li>`).join('\n')}
    </ul>
    <p class="more">${t('a', 'Read the privacy policy', 'Lee la política de privacidad', 'href="privacy"')}</p>
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
fs.writeFileSync('privacy.html', privacyPage());
