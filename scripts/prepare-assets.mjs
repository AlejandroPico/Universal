import {gunzipSync} from 'node:zlib';
import { createHash } from 'node:crypto';
import planck from '../public/data/atlas/planck.json' with {type:'json'};
import { access, mkdir, stat, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

await mkdir(resolve('public/science-models'),{recursive:true});
await writeFile(resolve('public/science-models/ryugu.obj'),gunzipSync(await readFile(resolve('public/science-models/ryugu.obj.gz'))));

const nasaRoot = 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/Images%20and%20Textures';
const assets = [
 ['public/models/churyumov-gerasimenko.obj','https://naif.jpl.nasa.gov/pub/naif/ROSETTA/kernels/dsk/ROS_CG_K024_OSPCLPS_N_V2.OBJ'],
 ['public/models/tempel-1.obj','https://naif.jpl.nasa.gov/pub/naif/ROSETTA/kernels/dsk/TEMPEL1_9P_K032_THO_V01.OBJ'],
 ['public/textures/earth-night-science.jpg','https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg'],
 ['public/models/eros.glb','https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/e/Eros_1_10.glb'],
 ['public/models/itokawa.glb','https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/i/Itokawa_1_1.glb'],
 ['public/models/bennu.glb','https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/b/Bennu_1_1.glb'],
 ['public/textures/mercury-enhanced.jpg','https://images-assets.nasa.gov/image/PIA17386/PIA17386~orig.jpg'],
 // public/textures/cmb-planck-r3-4k.jpg and public/textures/cmb-planck-r3-8k.jpg
 ...planck.files.map(x=>['public/'+x.file,x.url]),
 ['public/textures/cmb-wmap-equirectangular.png','https://lambda.gsfc.nasa.gov/product/wmap/dr4/sos/5year/ilc/wmap_ilc_5yr_v3_200uK_RGB.png'],
  ['public/textures/milky-way-eso0932a.jpg','https://cdn.eso.org/images/large/eso0932a.jpg'],
  ['public/textures/andromeda-full-dss2.jpg','https://cdn.esahubble.org/archives/images/publicationjpg/heic1502b.jpg'],
  ['public/textures/phobos.jpg', `${nasaRoot}/Mars%20-%20Phobos/Mars%20-%20Phobos.jpg`],
  ['public/textures/deimos.jpg', `${nasaRoot}/Mars%20-%20Deimos/Mars%20-%20Deimos.jpg`],
  ['public/textures/io.jpg', `${nasaRoot}/Jupiter%20-%20Io%20%28A%29/Jupiter%20-%20Io%20%28A%29.jpg`],
  ['public/textures/europa.jpg', `${nasaRoot}/Jupiter%20-%20Europa/Jupiter%20-%20Europa.jpg`],
  ['public/textures/ganymede.jpg', `${nasaRoot}/Jupiter%20-%20Ganymede/Jupiter%20-%20Ganymede.jpg`],
  ['public/textures/callisto.jpg', `${nasaRoot}/Jupiter%20-%20Callisto/Jupiter%20-%20Callisto.jpg`],
  ['public/textures/enceladus.jpg', `${nasaRoot}/Saturn%20-%20Enceladus/Saturn%20-%20Enceladus.jpg`],
  ['public/textures/titan.jpg', `${nasaRoot}/Saturn%20-%20Titan/Saturn%20-%20Titan.jpg`],
  ['public/textures/triton.jpg', `${nasaRoot}/Neptune%20-%20Triton/Neptune%20-%20Triton.jpg`],

  ['public/textures/earth-natural.png', 'https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png'],
  ['public/textures/earth-day.jpg', `${nasaRoot}/Earth%20(A)/Earth%20(A).jpg`],
  ['public/textures/earth-night.png', 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png'],
  ['public/textures/earth-roughness.jpg', 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_bump_roughness_clouds_4096.jpg'],
  ['public/textures/earth-clouds.png', 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'],
  ['public/textures/moon-color.jpg', 'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg'],
  ['public/textures/moon-height.jpg', 'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_3_8bit.jpg'],
  ['public/textures/sun-surface.jpg', 'https://svs.gsfc.nasa.gov/vis/a030000/a030300/a030362/euvi_aia304_2012_carrington_print.jpg'],
  ['public/textures/venus.jpg', `${nasaRoot}/Venus/Venus.jpg`],
  ['public/textures/mars.jpg', `${nasaRoot}/Mars/Mars.jpg`],
  ['public/textures/jupiter.jpg', `${nasaRoot}/Jupiter/Jupiter.jpg`],
  ['public/textures/saturn.jpg', `${nasaRoot}/Saturn/Saturn.jpg`],
  ['public/textures/neptune.jpg', `${nasaRoot}/Neptune/Neptune.jpg`],
  ['public/models/mercury.glb', 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/m/Mercury_1_4878.glb'],
  ['public/models/phobos.glb', 'https://assets.science.nasa.gov/content/dam/science/psd/mars/resources/gltf_files/24878_Phobos_1_1000.glb'],
  ['public/models/deimos.glb', 'https://assets.science.nasa.gov/content/dam/science/psd/mars/resources/gltf_files/24879_Deimos_1_1000.glb'],
  ['public/models/venus-clouds.glb', 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/v/Venus_1_12103.glb'],
  ['public/models/venus-surface.glb', 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/v/Venussurface_1_12103.glb'],
  ['public/models/uranus.glb', 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/u/Uranus_1_51118.glb'],
  ["public/models/jupiter.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/j/Jupiter_1_142984.glb"],
  ["public/models/saturn.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/s/Saturn_1_120536.glb"],
  ["public/models/neptune.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/n/Neptune_1_49528.glb"],
  ["public/models/pluto.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/p/l/Pluto_1_2374.glb"],
  ["public/models/charon.glb", "https://science.nasa.gov/wp-content/uploads/2023/09/Charon_1_2.glb"],
  ["public/models/mimas.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/m/Mimas_1_1000.glb"],
  ["public/models/tethys.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/t/Tethys_1_1077-1.glb"],
  ["public/models/dione.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/d/Dione_1_1123.glb"],
  ["public/models/rhea.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/r/Rhea_1_1529.glb"],
  ["public/models/iapetus.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/i/Iapetus_1_1471.glb"],
  ["public/models/miranda.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/m/Miranda_1_472.glb"],
  ["public/models/ariel.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/a/Ariel_1_1158.glb"],
  ["public/models/umbriel.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/u/Umbriel_1_1169.glb"],
  ["public/models/titania.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/t/Titania_1_1577.glb"],
  ["public/models/oberon.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/o/Oberon_1_1523.glb"],
  ["public/models/triton.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/t/Triton_1_2707.glb"],
  ["public/models/ceres.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/c/Ceres_1_1000.glb"],
  ["public/models/vesta.glb", "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/v/Vesta_1_100.glb"],
];

for (const [relativePath, url] of assets) {
  const target = resolve(relativePath);
  try {
    await access(target);
    if ((await stat(target)).size > 10_000) continue;
  } catch { /* El recurso todavía no existe. */ }

  // Stable copies from the last successful release; exact bytes are pinned.
  // Keep the original scientific URL above as provenance and recovery source.
  const publishedHashes = {"public/textures/cmb-wmap-equirectangular.png": "ab19e642d311919058aeaabbc9509ffd001c33e720319016e4d23dc8afca72b4", "public/textures/cmb-planck-r3-8k.jpg": "6f4784634777d37eccbdf3905990ee5f1e989dc2653660b2215ec596fcde00c9", "public/textures/cmb-planck-r3-4k.jpg": "f94ab40e417b5b84cb488618c12579d21c1a4a32e6d6bae77e9b3a8a1509353a"};
  const expectedHash=publishedHashes[relativePath];
  const mirror=expectedHash ? 'https://alejandropico.github.io/Universal/'+relativePath.replace(/^public\//,'') : null;
  let data, lastError;
  for (const candidate of [mirror, url, url].filter(Boolean)) {
    try {
      console.log(`Descargando ${relativePath} desde ${candidate}`);
      const response = await fetch(candidate, {signal: AbortSignal.timeout(180_000)});
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      data = new Uint8Array(await response.arrayBuffer());
      if (expectedHash && createHash('sha256').update(data).digest('hex') !== expectedHash) throw Error('SHA-256 no coincide');
      break;
    } catch (error) { lastError=error; data=null; console.warn(`${relativePath}: ${error.message}`); }
  }
  if (!data) throw new Error(`No se pudo descargar ${relativePath}`, {cause:lastError});
  const jpeg = data[0]===0xff && data[1]===0xd8;
  const png = data[0]===0x89 && data[1]===0x50;
  const glb = data[0]===0x67 && data[1]===0x6c;
  const obj=relativePath.endsWith('.obj')&&/^\s*v\s+[-.0-9]/m.test(new TextDecoder().decode(data))&&/^\s*f\s+/m.test(new TextDecoder().decode(data));
  if (data.length < 10_000 || !(jpeg || png || glb || obj)) throw new Error(`Recurso inválido: ${relativePath}. No se guardará una respuesta HTML como imagen.`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, data);
  console.log(`Preparado ${relativePath} (${data.length} bytes).`);
}
