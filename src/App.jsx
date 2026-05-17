// v5
import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://tzhrnnnpataoxklbtogn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6aHJubm5wYXRhb3hrbGJ0b2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzg4NTIsImV4cCI6MjA5MzcxNDg1Mn0.rn6f4SE9hozourQgP_z6HuYt45xe7Ws4MHrbeoH0hm4";
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" };

async function dbGet(id) {
  try { const r = await fetch(`${SUPABASE_URL}/rest/v1/games?id=eq.${id}`, { headers: H }); const d = await r.json(); return d[0] || null; } catch(e) { return null; }
}
async function dbInsert(row) {
  try { const r = await fetch(`${SUPABASE_URL}/rest/v1/games`, { method:"POST", headers:{...H, Prefer:"return=representation"}, body:JSON.stringify(row) }); const d = await r.json(); return d[0] || null; } catch(e) { return null; }
}
async function dbPatch(id, patch) {
  try { await fetch(`${SUPABASE_URL}/rest/v1/games?id=eq.${id}`, { method:"PATCH", headers:H, body:JSON.stringify(patch) }); } catch(e) {}
}
async function dbFinishPlayer(gameId, role, answers) {
  try { await fetch(`${SUPABASE_URL}/rest/v1/rpc/finish_player`, { method:"POST", headers:H, body:JSON.stringify({ game_id: gameId, role, answers }) }); } catch(e) {}
}
async function dbAovNext(gameId, playerName) {
  try { await fetch(`${SUPABASE_URL}/rest/v1/rpc/aov_next`, { method:"POST", headers:H, body:JSON.stringify({ game_id: gameId, player_name: playerName }) }); } catch(e) {}
}
async function dbGetMsgs(gameId, qIdx) {
  try { const r = await fetch(`${SUPABASE_URL}/rest/v1/messages?game_id=eq.${gameId}&question_index=eq.${qIdx}&order=created_at.asc`, { headers:H }); return r.json(); } catch(e) { return []; }
}
async function dbInsertMsg(msg) {
  try { await fetch(`${SUPABASE_URL}/rest/v1/messages`, { method:"POST", headers:H, body:JSON.stringify(msg) }); } catch(e) {}
}

const QUESTIONS = {
  decouverte: {
    classiques: [
      "C'est quoi ton plus grand rêve dans la vie ?","T'as peur de quoi en ce moment ?","Quel est ton meilleur souvenir d'enfance ?","Si tu pouvais changer une chose dans ta vie, ce serait quoi ?","C'est quoi la chose dont tu es le plus fier(e) ?","T'as déjà regretté quelque chose de vraiment important ?","C'est quoi ton endroit préféré dans le monde ?","Si tu pouvais voyager n'importe où demain, tu irais où ?","Qu'est-ce qui te rend heureux(se) instantanément ?","C'est quoi ta plus grande qualité selon toi ?","Et ton plus grand défaut ?","T'as une passion cachée que peu de gens connaissent ?","Si tu devais décrire ta vie en un film, lequel ce serait ?","C'est quoi la dernière chose qui t'a vraiment ému(e) ?","T'aurais fait quoi si tu n'avais pas choisi ta voie actuelle ?","Qu'est-ce que tu aimerais que les gens retiennent de toi ?","C'est quoi ta définition du bonheur ?","T'as une croyance que peu de gens partagent ?","Si tu pouvais dîner avec n'importe qui dans l'histoire, ce serait qui ?","C'est quoi la dernière fois que t'as vraiment ri aux éclats ?","T'as un rituel quotidien auquel tu tiens vraiment ?","C'est quoi ton rapport à la solitude ?","Si tu avais une superpower, ce serait laquelle ?","C'est quoi la chose la plus courageuse que t'as jamais faite ?","T'as déjà vécu un moment qui t'a complètement changé(e) ?","C'est quoi ton plus grand regret ?","T'aimes mieux être aimé(e) ou respecté(e) ?","C'est quoi ta vision d'une vie réussie ?","T'as déjà menti pour protéger quelqu'un ?","C'est quoi la chose la plus difficile que t'aies jamais traversée ?","C'est quoi ton rapport à la famille ?","T'as un objectif que tu n'as pas encore atteint ?","T'aimes mieux les matins ou les soirs ?","T'as des ambitions que tu n'oses pas dire à voix haute ?","C'est quoi le truc le plus bizarre que t'aies jamais fait ?","C'est quoi ta vision de l'amitié parfaite ?","C'est quoi le conseil que tu donnerais à ton toi d'il y a 5 ans ?","T'as un souvenir qui te fait sourire à chaque fois ?","C'est quoi ta philosophie de vie en une phrase ?","T'aimes mieux donner ou recevoir ?","T'as déjà fait une chose que personne ne sait ?","C'est quoi le truc qui te manque le plus en ce moment ?","T'aurais plutôt vivre 100 ans normalement ou 50 ans intensément ?","T'as des pensées que tu n'oses jamais dire ?","T'aimes mieux les surprises ou tout planifier ?","T'as déjà été jaloux(se) de quelqu'un ? De quoi ?","C'est quoi ton rapport au changement ?","T'as déjà pleuré devant quelqu'un et regretté de l'avoir fait ?","C'est quoi le truc que t'as du mal à pardonner ?"
    ],
    creatives: [
      "Quelle chanson résume ta vie en ce moment ?","Si ta vie était une série Netflix, quel serait le titre ?","Quelle couleur tu associes à ton humeur cette semaine ?","Si tu étais un plat, t'aurais quel goût ?","Quelle chanson te ferait pleurer si tu l'écoutais maintenant ?","Si tu pouvais envoyer un message à ton futur toi dans 10 ans, t'écrirais quoi ?","T'es plutôt quel temps qu'il fait aujourd'hui et pourquoi ?","Si ta personnalité était un genre musical, ce serait lequel ?","C'est quoi l'objet chez toi qui a le plus de valeur sentimentale ?","Quelle odeur te rappelle immédiatement quelque chose de fort ?","Si tu étais un personnage de film, lequel tu serais et pourquoi ?","C'est quoi le dernier rêve dont tu te souviens ?","Si ta vie avait une bande-son, quel artiste la composerait ?","T'es plutôt lever de soleil ou coucher de soleil ?","Si tu devais te décrire avec un animal, ce serait lequel ?","Quelle chanson tu mettrais si tu devais entrer dans une pièce de façon épique ?","C'est quoi ton film doudou, celui que t'as vu 10 fois ?","T'associes quelle chanson à ton meilleur souvenir ?","Si ta vie était un livre, t'en serais à quel chapitre ?","C'est quoi le plat qui te ramène immédiatement à ton enfance ?","Si tu devais vivre dans l'univers d'une série, ce serait laquelle ?","Quelle chanson t'écoutes quand tu veux te sentir invincible ?","T'es plutôt océan ou montagne ?","C'est quoi ton endroit parfait pour réfléchir ?","Si tu étais une saison, t'aurais laquelle et pourquoi ?","C'est quoi le livre ou film qui t'a le plus marqué(e) ?","T'es plutôt café du matin ou coucher tard le soir ?","Si ta personnalité était une ville, ce serait laquelle ?","Quelle chanson t'écoutes quand tu es triste mais que tu veux l'être encore plus ?","C'est quoi une image mentale qui te rend instantanément heureux(se) ?"
    ]
  },
  epice: [
    "C'est quoi un fantasme que t'as jamais osé dire ?","T'as déjà envoyé un message à la mauvaise personne ? C'était quoi ?","C'est quoi le truc le plus osé que t'aies jamais fait ?","T'as déjà eu le coup de foudre ? Raconte.","C'est quoi ton plus grand turn-on ?","T'as déjà été attiré(e) par quelqu'un que t'aurais pas dû ?","C'est quoi la chose la plus romantique que t'aies jamais faite ?","T'as déjà menti sur tes sentiments ?","T'as déjà eu des sentiments pour deux personnes en même temps ?","T'as déjà écrit une lettre d'amour que t'as jamais envoyée ?","C'est quoi ton plus grand turn-off ?","T'as déjà fait quelque chose d'interdit et adoré ça ?","C'est quoi le message le plus flirty que t'aies jamais envoyé ?","T'as déjà eu une relation secrète ?","C'est quoi la chose la plus coquine que t'aies jamais faite ?","C'est quoi ton fantasme de lieu ?","T'as déjà embrassé quelqu'un par défi et aimé ça ?","C'est quoi la chose la plus douce qu'on t'ait jamais dite ?","T'as déjà utilisé quelqu'un pour oublier quelqu'un d'autre ?","C'est quoi le truc qui te rend fou/folle chez l'autre ?","T'as déjà eu une nuit que tu n'oublieras jamais ?","C'est quoi ton signe qu'on te plaît vraiment ?","C'est quoi la chose la plus courageuse que t'aies faite par amour ?","T'as déjà eu envie de tout plaquer pour quelqu'un ?","T'as déjà été le/la premier(e) à dire 'je t'aime' ?","C'est quoi ta définition d'une nuit parfaite ?","C'est quoi le geste qui te fond à chaque fois ?","T'as déjà gardé un secret lourd dans une relation ?","T'as déjà été obsédé(e) par quelqu'un ?","T'as déjà aimé quelqu'un qui ne t'aimait pas en retour ?","T'as déjà envoyé une photo que tu regrettes ?","C'est quoi le souvenir le plus chaud que t'aies ?","C'est quoi ton rapport à l'intimité physique vs émotionnelle ?","C'est quoi le rituel que t'as pour te sentir séduisant(e) ?","T'as déjà fait une déclaration qui a tout changé ?","C'est quoi la chose la plus intense que t'aies ressentie pour quelqu'un ?"
  ]
};

const DILEMMES = {
  soft: [
    {a:"Savoir quand tu vas mourir",b:"Savoir comment tu vas mourir"},{a:"Ne plus jamais écouter de musique",b:"Ne plus jamais regarder de films"},{a:"Être super riche mais seul(e)",b:"Être fauché(e) mais très entouré(e)"},{a:"Tout recommencer à 15 ans avec ta mémoire actuelle",b:"Continuer ta vie mais avec 10 ans de plus"},{a:"Toujours dire ce que tu penses",b:"Ne jamais pouvoir mentir"},{a:"Lire dans les pensées",b:"Être invisible"},{a:"Perdre tous tes souvenirs",b:"Ne jamais en créer de nouveaux"},{a:"Vivre 100 ans sans passion",b:"Vivre 50 ans intensément"},{a:"Être trop honnête",b:"Être trop gentil(le)"},{a:"Tout savoir de ton futur",b:"Ne rien savoir du tout"},{a:"Avoir beaucoup d'amis superficiels",b:"Avoir 2 vrais amis pour la vie"},{a:"Être célèbre mais sans argent",b:"Être riche mais totalement inconnu(e)"},{a:"Savoir ce que les autres pensent vraiment de toi",b:"Ne jamais le savoir"},{a:"Ne plus jamais utiliser ton téléphone",b:"Ne plus jamais regarder Netflix"},{a:"Être trop sensible",b:"Ne rien ressentir"},{a:"Pouvoir voler",b:"Pouvoir être invisible"},{a:"Toujours arriver en retard",b:"Toujours arriver bien trop tôt"},{a:"Avoir un talent extraordinaire que personne ne verra jamais",b:"Être médiocre mais reconnu(e)"},{a:"Rater quelque chose d'important par ta faute",b:"Rater la même chose par la faute de quelqu'un d'autre"},{a:"Ne jamais avoir froid",b:"Ne jamais avoir chaud"}
  ],
  epice: [
    {a:"Être quitté(e)",b:"Quitter"},{a:"Que ton ex soit heureux(se) sans toi",b:"Qu'il/elle soit malheureux(se) sans toi"},{a:"Une relation passionnelle et toxique",b:"Une relation stable mais sans étincelle"},{a:"Tout savoir sur les ex de l'autre",b:"Que l'autre sache tout sur les tiens"},{a:"Être trompé(e) et ne jamais le savoir",b:"Le savoir et ne pas pouvoir en parler"},{a:"Une nuit inoubliable sans lendemain",b:"Une relation longue mais sans folie"},{a:"Aimer sans être aimé(e) en retour",b:"Être aimé(e) sans vraiment aimer"},{a:"Que l'autre lise tous tes messages",b:"Que l'autre lise tous tes rêves"},{a:"Être trop jaloux(se)",b:"Ne ressentir aucune jalousie"},{a:"Dire 'je t'aime' en premier sans l'entendre en retour",b:"Ne jamais le dire même si tu le penses"},{a:"Que l'autre sache exactement ce que tu aimes au lit",b:"Garder une part de mystère pour toujours"},{a:"Toujours prendre l'initiative",b:"Ne jamais la prendre"},{a:"Être la meilleure expérience que l'autre ait eue",b:"Que l'autre soit la meilleure que t'aies eue"},{a:"Séduire facilement tout le monde sans être vraiment aimé(e)",b:"Séduire une seule personne mais être aimé(e) follement"},{a:"Que l'autre connaisse tous tes fantasmes",b:"Découvrir tous les siens"},{a:"Rester avec quelqu'un que tu aimes mais qui ne te rend pas heureux(se)",b:"Le quitter et risquer de le regretter toute ta vie"},{a:"Une passion qui détruit tout",b:"Une tranquillité qui n'excite personne"},{a:"Que l'autre change pour toi",b:"Changer pour l'autre"},{a:"Une attirance folle sans amour",b:"Un amour profond sans attirance physique"},{a:"Que l'autre fantasme sur quelqu'un d'autre",b:"Que tu fantasmes sur quelqu'un d'autre"}
  ]
};

// ─── ACTION OU VÉRITÉ ─────────────────────────────────────────────────────────
const AOV_VERITE = {
  soft: [
    "C'est quoi le truc le plus gênant que t'aies jamais fait en public ?",
    "T'as déjà eu le béguin pour quelqu'un que tu n'aurais pas dû ?",
    "C'est quoi ton défaut que tu assumes complètement ?",
    "T'as déjà menti à quelqu'un dans cette partie ? Sur quoi ?",
    "C'est quoi le compliment que tu aimerais recevoir mais que personne te fait ?",
    "T'as déjà été jaloux(se) de quelqu'un ici ? De quoi ?",
    "C'est quoi la chose la plus courageuse que t'aies jamais faite ?",
    "T'as un secret que t'as jamais dit à personne ?",
    "C'est quoi le truc le plus stupide que t'aies fait par amour ?",
    "T'as déjà fait quelque chose d'embarrassant que personne ne sait ?",
    "C'est quoi ta plus grande peur dans une relation ?",
    "T'as déjà dit oui alors que tu voulais dire non ?",
    "C'est quoi le mensonge que tu répètes le plus souvent ?",
    "T'as déjà été amoureux(se) sans le dire ? De qui ?",
    "C'est quoi la chose dont tu es secrètement fier(e) mais que tu n'avoues pas ?",
    "C'est quoi ton plus grand regret dans une relation ?",
    "T'as déjà dit 'je t'aime' sans le penser vraiment ?",
    "C'est quoi la chose la plus égoïste que t'aies jamais faite ?",
    "T'as déjà eu envie d'embrasser quelqu'un dans ce groupe ?",
    "C'est quoi ton plus grand complexe ?",
    "T'as déjà trahi la confiance de quelqu'un ? Comment ?",
    "C'est quoi la dernière fois que t'as vraiment pleuré et pourquoi ?",
    "T'as déjà ressenti quelque chose pour quelqu'un que t'aurais pas dû ?",
    "C'est quoi la pensée que t'oses jamais dire à voix haute ?",
    "T'as déjà fait semblant d'être quelqu'un d'autre pour plaire à quelqu'un ?",
    "C'est quoi la chose la plus intime que t'aies jamais partagée avec quelqu'un ?",
    "T'as déjà voulu quitter une situation mais t'es resté(e) par peur ?",
    "C'est quoi le moment où tu t'es senti(e) le plus seul(e) malgré les gens autour ?",
    "T'as déjà eu honte de quelque chose que tu as fait et tu te pardonnes pas encore ?",
    "C'est quoi la chose que tu voudrais changer dans ta façon d'aimer ?"
  ],
  hot: [
    "C'est quoi ton fantasme le plus sage ?",
    "T'as déjà été attiré(e) par quelqu'un dans ce groupe ?",
    "C'est quoi le truc le plus flirty que t'aies jamais fait ?",
    "T'as déjà embrassé quelqu'un par défi et adoré ça ?",
    "C'est quoi ton endroit préféré pour un baiser ?",
    "T'as déjà envoyé un message flirty à la mauvaise personne ?",
    "C'est quoi la dernière fois que t'as vraiment eu envie de quelqu'un ?",
    "T'as déjà fantasmé sur quelqu'un dans ce groupe ?",
    "C'est quoi le look qui te rend fou/folle chez quelqu'un ?",
    "T'as déjà eu un crush secret que personne ne sait ?",
    "C'est quoi la chose la plus romantique que quelqu'un ait jamais faite pour toi ?",
    "T'as déjà flirté avec quelqu'un sans t'en rendre compte ?",
    "C'est quoi ton signe d'intérêt quand quelqu'un te plaît ?",
    "C'est quoi ton rituel de séduction ?",
    "C'est quoi ton plus grand turn-on ?",
    "T'as déjà eu des pensées très précises sur quelqu'un dans ce groupe ?",
    "C'est quoi le truc le plus osé que t'aies jamais fait ?",
    "T'as déjà eu envie de quelque chose et pas osé le demander ? C'était quoi ?",
    "C'est quoi ta définition d'une nuit parfaite avec quelqu'un ?",
    "T'as déjà fait quelque chose d'interdit et adoré ça ?",
    "C'est quoi le truc qui te rend fou/folle chez quelqu'un physiquement ?",
    "C'est quoi la chose la plus coquine que t'aies jamais faite ?",
    "T'as déjà menti sur ton expérience pour impressionner quelqu'un ?",
    "C'est quoi ton endroit idéal pour un moment intime ?",
    "T'as déjà eu une nuit d'un soir ? Raconte sans nommer.",
    "C'est quoi le truc que tu n'oserais jamais demander à quelqu'un ?",
    "C'est quoi ton fantasme de situation le plus récurrent ?",
    "C'est quoi un fantasme que t'as jamais osé dire à voix haute ?",
    "T'as déjà eu une nuit que tu n'oublieras jamais ? Décris sans nommer.",
    "C'est quoi le désir que t'oses jamais avouer ?",
    "C'est quoi la chose la plus coquine que t'aies jamais faite et adorée ?",
    "T'as déjà eu envie de quelqu'un dans ce groupe au point d'y penser sérieusement ?",
    "C'est quoi ton fantasme le plus précis et détaillé ?"
  ]
};

// Actions selon contexte (distance vs sur place) et intensité
const AOV_ACTION = {
  soft: {
    distance: [
      // Niveau 1
      "Envoie une photo de ta tête en ce moment sans te préparer.",
      "Envoie un audio de 10 secondes en te décrivant sans réfléchir.",
      "Fais une grimace ridicule et envoie la photo.",
      "Montre l'objet le plus bizarre dans la pièce où tu es.",
      "Envoie la dernière photo que t'as prise sans la choisir.",
      "Fais une danse de 10 secondes et envoie la vidéo.",
      "Imite quelqu'un du groupe dans un audio — ils doivent deviner qui.",
      // Niveau 2
      "Envoie un message vocal en avouant quelque chose que tu n'as jamais dit.",
      "Montre une photo de toi dont t'es pas fier(e).",
      "Dis 3 choses sincères sur quelqu'un dans le groupe dans le chat.",
      "Appelle quelqu'un en dehors du jeu et dis-lui ce que tu penses vraiment de lui.",
      "Envoie un vocal de 20 secondes en décrivant ta journée comme si c'était une scène de film.",
      // Niveau 3
      "Envoie un message à quelqu'un en dehors du jeu que t'aurais jamais osé envoyer.",
      "Dis dans le chat ta plus grande insécurité sans filtre.",
      "Fais une déclaration sincère et personnelle à quelqu'un du groupe dans le chat."
    ],
    surplace: [
      // Niveau 1
      "Fais une grimace ridicule pendant 10 secondes.",
      "Imite quelqu'un du groupe — les autres doivent deviner qui.",
      "Fais le tour de la pièce en marchant comme un pingouin.",
      "Chante 10 secondes d'une chanson au hasard.",
      "Dis quelque chose de sincère à la personne à ta gauche.",
      // Niveau 2
      "Fais un câlin de 10 secondes à la personne de ton choix.",
      "Masse les épaules de la personne à ta droite pendant 30 secondes.",
      "Chuchote quelque chose de gentil à l'oreille de quelqu'un.",
      "Fais un bisou sur la joue de la personne de ton choix.",
      "Tiens la main de quelqu'un pendant 1 minute sans parler.",
      // Niveau 3
      "Dis à voix haute la chose la plus honnête que tu penses sur toi-même.",
      "Fais une déclaration sincère à quelqu'un dans la pièce, face à face.",
      "Regarde quelqu'un dans les yeux en silence pendant 30 secondes sans sourire."
    ]
  },
  hot: {
    distance: [
      // Niveau 1
      "Envoie une photo de toi en ce moment sans te préparer.",
      "Envoie un audio en murmurant quelque chose de flirty.",
      "Montre la partie de ton corps dont tu es le plus fier(e) en photo.",
      "Envoie un message dans le chat comme si tu draguais quelqu'un pour la première fois.",
      "Envoie un audio en décrivant ce que tu portes en ce moment.",
      "Dis dans le chat ce que tu ferais si quelqu'un du groupe frappait à ta porte là maintenant.",
      // Niveau 2
      "Enlève un vêtement et envoie une photo (visage caché si tu veux).",
      "Envoie un audio en décrivant ton fantasme de lieu avec des détails.",
      "Envoie une photo de la pièce où tu es avec une ambiance qui te représente.",
      "Envoie un message comme si tu envoyais un texto à 2h du matin à quelqu'un qui te plaît.",
      "Envoie un audio de 20 secondes en décrivant ce qui te ferait craquer chez quelqu'un ce soir.",
      "Dis dans le chat ce que t'attendrais de quelqu'un du groupe si la partie se terminait chez toi.",
      // Niveau 3
      "Enlève deux vêtements et envoie une photo (visage caché si tu veux).",
      "Envoie un audio en décrivant ton fantasme le plus précis avec des détails.",
      "Envoie une photo de la partie de ton corps que tu trouves la plus séduisante.",
      "Envoie un vocal en décrivant exactement ce que tu aimerais qu'on te fasse ce soir.",
      "Dis dans le chat ton désir le plus honnête du moment sans filtre."
    ],
    surplace: [
      // Niveau 1
      "Fais un bisou sur la joue de la personne de ton choix.",
      "Murmure quelque chose de flirty à l'oreille de quelqu'un.",
      "Tiens la main de quelqu'un pendant 2 minutes en le regardant dans les yeux.",
      "Fais un compliment très personnel à quelqu'un dans la pièce.",
      "Masse le dos de la personne de ton choix pendant 1 minute.",
      // Niveau 2
      "Fais un bisou dans le cou de la personne de ton choix.",
      "Chuchote ton fantasme à l'oreille de quelqu'un.",
      "Enlève un vêtement devant tout le groupe.",
      "Passe tes doigts dans les cheveux de la personne de ton choix pendant 30 secondes.",
      "Fais un bisou sur l'épaule de quelqu'un.",
      "Regarde quelqu'un dans les yeux pendant 1 minute entière sans sourire ni parler.",
      // Niveau 3
      "Enlève deux vêtements devant le groupe.",
      "Fais un bisou dans le cou de quelqu'un et reste 5 secondes.",
      "Dis à voix haute à quelqu'un du groupe ce que tu ferais avec lui/elle si vous étiez seul(e)s.",
      "Masse l'intérieur des avant-bras de la personne de ton choix pendant 1 minute.",
      "Chuchote à l'oreille de quelqu'un le truc le plus osé que tu oserais faire ce soir."
    ]
  }
};

function getQuestions(mode, count) {
  if (mode==="epice") return [...QUESTIONS.epice].sort(()=>Math.random()-.5).slice(0,count);
  const cl=[...QUESTIONS.decouverte.classiques].sort(()=>Math.random()-.5);
  const cr=[...QUESTIONS.decouverte.creatives].sort(()=>Math.random()-.5);
  const nCr=Math.round(count*.27);
  return [...cl.slice(0,count-nCr),...cr.slice(0,nCr)].sort(()=>Math.random()-.5);
}
function getDilemmes(intensity, count) {
  return [...DILEMMES[intensity]].sort(()=>Math.random()-.5).slice(0,count);
}

function getAovSequence(intensity, context, playerNames, roundsPerPlayer) {
  const allVerites = [...AOV_VERITE[intensity]].sort(()=>Math.random()-.5);
  const allActions = [...AOV_ACTION[intensity][context]].sort(()=>Math.random()-.5);
  const sequence = [];
  let vIdx = 0, aIdx = 0;

  // Pour chaque joueur, construire ses rounds avec 50/50 vérité/action
  for (let round = 0; round < roundsPerPlayer; round++) {
    for (let p = 0; p < playerNames.length; p++) {
      const player = playerNames[p];
      const progress = round / roundsPerPlayer;
      const level = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
      // Chaque joueur alterne vérité/action à chaque round
      const isVerite = round % 2 === p % 2;

      let text, type;
      if (isVerite && vIdx < allVerites.length) {
        text = allVerites[vIdx++]; type = "verite";
      } else if (!isVerite && aIdx < allActions.length) {
        text = allActions[aIdx++]; type = "action";
      } else if (vIdx < allVerites.length) {
        text = allVerites[vIdx++]; type = "verite";
      } else {
        text = allActions[aIdx % allActions.length]; aIdx++; type = "action";
      }

      sequence.push({ player, type, text, level });
    }
  }
  return sequence;
}

function generateCode() {
  return Math.random().toString(36).substring(2,7).toUpperCase();
}

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=Instrument+Sans:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--bg:#0d0d10;--s1:#15151b;--s2:#1e1e27;--s3:#27272f;--border:rgba(255,255,255,0.07);--gold:#d4a853;--gold2:#f0cc7a;--text:#ece8e0;--muted:rgba(236,232,224,0.38);--muted2:rgba(236,232,224,0.65);--green:#6fcf8a;--red:#e07878;--purple:#a78bfa;}
  html,body{height:100%;}
  body{background:var(--bg);color:var(--text);font-family:'Instrument Sans',sans-serif;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--s3);border-radius:2px;}
  .screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 20px;}
  .wordmark{font-family:'Fraunces',serif;font-size:52px;font-weight:600;letter-spacing:-2px;line-height:1;background:linear-gradient(135deg,var(--gold) 0%,var(--gold2) 60%,#fff8e1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .wordmark-sub{font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:var(--muted);margin-top:6px;text-align:center;}
  .card{width:100%;max-width:400px;background:var(--s1);border:1px solid var(--border);border-radius:24px;padding:32px 28px;margin-top:28px;animation:up .35s cubic-bezier(.22,1,.36,1);}
  @keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  .card-title{font-family:'Fraunces',serif;font-size:24px;font-weight:600;margin-bottom:22px;letter-spacing:-.5px;}
  .btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px 20px;border-radius:14px;font-family:'Instrument Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;border:none;transition:all .18s;}
  .btn+.btn{margin-top:10px;}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#1a1200;box-shadow:0 4px 20px rgba(212,168,83,.25);}
  .btn-gold:hover:not(:disabled){transform:translateY(-1px);}
  .btn-ghost{background:var(--s2);color:var(--muted2);border:1px solid var(--border);}
  .btn-ghost:hover:not(:disabled){border-color:var(--gold);color:var(--text);}
  .btn-purple{background:linear-gradient(135deg,#7c3aed,var(--purple));color:#fff;box-shadow:0 4px 20px rgba(124,58,237,.25);}
  .btn-purple:hover:not(:disabled){transform:translateY(-1px);}
  .btn:disabled{opacity:.35;cursor:not-allowed;}
  .lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;}
  .inp{width:100%;padding:13px 16px;border-radius:12px;border:1px solid var(--border);background:var(--s2);color:var(--text);font-family:'Instrument Sans',sans-serif;font-size:15px;outline:none;transition:border-color .2s;margin-bottom:14px;}
  .inp:focus{border-color:var(--gold);}
  .inp::placeholder{color:var(--muted);}
  .mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;}
  .mode-card{padding:16px 10px;border-radius:16px;border:1.5px solid var(--border);background:var(--s2);cursor:pointer;transition:all .18s;text-align:center;position:relative;overflow:hidden;}
  .mode-card::before{content:'';position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 50% 0%,rgba(212,168,83,.12),transparent 70%);transition:opacity .2s;}
  .mode-card:hover::before,.mode-card.sel::before{opacity:1;}
  .mode-card.sel{border-color:var(--gold);}
  .mode-card.purple-card.sel{border-color:var(--purple);}
  .mode-card.purple-card::before{background:radial-gradient(circle at 50% 0%,rgba(167,139,250,.12),transparent 70%);}
  .mode-emoji{font-size:24px;margin-bottom:6px;}
  .mode-name{font-size:12px;font-weight:600;}
  .mode-desc{font-size:10px;color:var(--muted);margin-top:3px;}
  .ctx-row{display:flex;gap:8px;margin-bottom:20px;}
  .ctx-btn{flex:1;padding:13px;border-radius:12px;border:1.5px solid var(--border);background:var(--s2);color:var(--muted2);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;text-align:center;}
  .ctx-btn.sel{border-color:var(--purple);color:var(--purple);background:rgba(167,139,250,.07);}
  .count-row{display:flex;gap:8px;margin-bottom:20px;}
  .cnt-btn{flex:1;padding:11px;border-radius:11px;border:1.5px solid var(--border);background:var(--s2);color:var(--muted2);font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .18s;}
  .cnt-btn.sel{border-color:var(--gold);color:var(--gold);background:rgba(212,168,83,.07);}
  .divider{height:1px;background:var(--border);margin:20px 0;}
  .cq-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;}
  .cq-row{display:flex;gap:8px;margin-bottom:10px;}
  .cq-row .inp{margin-bottom:0;flex:1;}
  .cq-add-btn{padding:13px 16px;border-radius:12px;border:1.5px solid var(--gold);background:transparent;color:var(--gold);cursor:pointer;font-size:20px;flex-shrink:0;}
  .cq-item{display:flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--border);border-radius:11px;padding:10px 14px;font-size:13px;margin-bottom:6px;}
  .cq-item span{flex:1;color:var(--muted2);}
  .cq-rm{background:none;border:none;color:var(--red);cursor:pointer;font-size:17px;}
  .code-box{background:var(--s2);border:1px solid var(--border);border-radius:18px;padding:24px;text-align:center;margin:18px 0;position:relative;overflow:hidden;}
  .code-box::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% -20%,rgba(212,168,83,.08),transparent 65%);}
  .code-big{font-family:'Fraunces',serif;font-size:46px;font-weight:600;letter-spacing:10px;color:var(--gold);position:relative;}
  .code-hint{font-size:11px;color:var(--muted);margin-top:6px;position:relative;}
  .status-row{display:flex;gap:8px;margin:14px 0;}
  .pill{flex:1;padding:11px 12px;border-radius:11px;text-align:center;background:var(--s2);border:1px solid var(--border);font-size:13px;color:var(--muted2);transition:all .3s;}
  .pill.ok{border-color:var(--green);color:var(--green);background:rgba(111,207,138,.06);}
  .dots{display:flex;gap:6px;justify-content:center;margin:14px 0;}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--gold);animation:blink 1.3s ease-in-out infinite;}
  .dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
  @keyframes blink{0%,80%,100%{opacity:.15;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
  .err{background:rgba(224,120,120,.08);border:1px solid rgba(224,120,120,.2);border-radius:12px;padding:12px 16px;font-size:13px;color:var(--red);margin-bottom:14px;text-align:center;}
  .refresh-btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:11px;border-radius:12px;background:transparent;border:1px solid var(--border);color:var(--muted2);font-family:'Instrument Sans',sans-serif;font-size:13px;cursor:pointer;margin-top:8px;transition:all .18s;}
  .refresh-btn:hover{border-color:var(--gold);color:var(--text);}
  .q-screen{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);}
  .q-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--s1);}
  .q-counter-badge{font-size:12px;font-weight:600;color:var(--gold);background:rgba(212,168,83,.1);border:1px solid rgba(212,168,83,.2);padding:5px 12px;border-radius:20px;}
  .q-mode-badge{font-size:11px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;}
  .q-body{flex:1;padding:28px 24px 20px;display:flex;flex-direction:column;}
  .q-progress{height:2px;background:var(--s3);border-radius:1px;margin-bottom:28px;overflow:hidden;}
  .q-progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));border-radius:1px;transition:width .5s cubic-bezier(.22,1,.36,1);}
  .q-text{font-family:'Fraunces',serif;font-size:22px;font-weight:300;font-style:italic;line-height:1.5;color:var(--text);flex:1;display:flex;align-items:center;}
  .q-footer{padding:16px 24px 28px;}
  .q-textarea{width:100%;min-height:110px;padding:15px 18px;border-radius:16px;border:1.5px solid var(--border);background:var(--s1);color:var(--text);font-family:'Instrument Sans',sans-serif;font-size:15px;resize:none;outline:none;transition:border-color .2s;margin-bottom:14px;line-height:1.6;}
  .q-textarea:focus{border-color:var(--gold);}
  .q-textarea::placeholder{color:var(--muted);}
  .d-screen{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);}
  .d-body{flex:1;padding:24px 20px;display:flex;flex-direction:column;gap:14px;}
  .d-vs{text-align:center;font-size:11px;color:var(--muted);letter-spacing:3px;text-transform:uppercase;}
  .d-choice{flex:1;padding:20px 18px;border-radius:18px;border:1.5px solid var(--border);background:var(--s2);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;text-align:center;font-size:15px;font-weight:500;line-height:1.5;color:var(--muted2);min-height:90px;}
  .d-choice:hover{border-color:rgba(212,168,83,.4);color:var(--text);}
  .d-choice.chosen{border-color:var(--gold);background:rgba(212,168,83,.08);color:var(--text);}
  .d-choice.disabled{opacity:.4;cursor:not-allowed;}
  .d-footer{padding:16px 20px 28px;}
  .d-waiting{text-align:center;font-size:13px;color:var(--muted);padding:12px 0;}
  .rv-screen{height:100vh;display:flex;flex-direction:column;background:var(--bg);overflow:hidden;}
  .rv-top{padding:16px 20px 14px;background:var(--s1);border-bottom:1px solid var(--border);flex-shrink:0;}
  .rv-top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
  .rv-badge{font-size:11px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;font-weight:600;}
  .rv-counter{font-size:12px;color:var(--muted);}
  .rv-progress{height:2px;background:var(--s3);border-radius:1px;overflow:hidden;}
  .rv-progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));border-radius:1px;transition:width .5s;}
  .rv-question-box{padding:14px 20px;border-bottom:1px solid var(--border);flex-shrink:0;}
  .rv-question-text{font-family:'Fraunces',serif;font-size:16px;font-weight:300;font-style:italic;color:var(--text);line-height:1.5;}
  .rv-answers{display:flex;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border);flex-shrink:0;}
  .rv-answer-card{flex:1;background:var(--s2);border:1px solid var(--border);border-radius:14px;padding:12px 13px;}
  .rv-answer-name{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--gold);font-weight:600;margin-bottom:5px;}
  .rv-answer-text{font-size:13px;line-height:1.55;color:var(--muted2);}
  .next-btn-wrap{padding:10px 16px;flex-shrink:0;}
  .dr-match{text-align:center;font-size:13px;padding:10px;border-radius:12px;margin-bottom:10px;}
  .dr-match.yes{background:rgba(111,207,138,.08);border:1px solid rgba(111,207,138,.2);color:var(--green);}
  .dr-match.no{background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.15);color:var(--gold);}
  .rv-chat{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .chat-msgs{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:5px;}
  .chat-bubble-wrap{display:flex;flex-direction:column;animation:msgIn .2s ease;}
  @keyframes msgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  .chat-bubble-wrap.me{align-items:flex-end;}
  .chat-bubble-wrap.them{align-items:flex-start;}
  .chat-sender{font-size:10px;color:var(--muted);margin-bottom:2px;padding:0 6px;}
  .chat-bubble{max-width:78%;padding:9px 14px;border-radius:18px;font-size:14px;line-height:1.5;word-break:break-word;}
  .chat-bubble.me{background:var(--gold);color:#1a1200;border-bottom-right-radius:5px;}
  .chat-bubble.them{background:var(--s2);color:var(--text);border:1px solid var(--border);border-bottom-left-radius:5px;}
  .chat-bubble.emoji-only{background:transparent!important;border:none!important;font-size:26px;padding:3px 5px;}
  .chat-bubble.system{background:rgba(255,255,255,.04);color:var(--muted2);font-size:12px;border:1px solid var(--border);border-radius:10px;text-align:center;width:100%;max-width:100%;}
  .chat-input-area{padding:8px 14px 14px;border-top:1px solid var(--border);background:var(--s1);flex-shrink:0;}
  .emoji-strip{display:flex;gap:6px;margin-bottom:8px;overflow-x:auto;scrollbar-width:none;}
  .emoji-strip::-webkit-scrollbar{display:none;}
  .emoji-chip{flex-shrink:0;width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:var(--s2);font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s;}
  .emoji-chip:hover{transform:scale(1.15);border-color:var(--gold);}
  .chat-row{display:flex;gap:8px;}
  .chat-inp{flex:1;padding:11px 16px;border-radius:22px;border:1.5px solid var(--border);background:var(--s2);color:var(--text);font-family:'Instrument Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s;}
  .chat-inp:focus{border-color:var(--gold);}
  .chat-inp::placeholder{color:var(--muted);}
  .chat-send{width:42px;height:42px;border-radius:50%;border:none;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#1a1200;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s;flex-shrink:0;}
  .chat-send:hover:not(:disabled){transform:scale(1.05);}
  .chat-send:disabled{opacity:.35;cursor:not-allowed;}
  .aov-screen{height:100vh;display:flex;flex-direction:column;background:var(--bg);overflow:hidden;}
  .aov-header{padding:14px 20px 10px;background:var(--s1);border-bottom:1px solid var(--border);flex-shrink:0;}
  .aov-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .aov-badge-soft{font-size:11px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;font-weight:600;}
  .aov-badge-hot{font-size:11px;color:var(--red);letter-spacing:2px;text-transform:uppercase;font-weight:600;}
  .aov-progress{height:2px;background:var(--s3);border-radius:1px;overflow:hidden;}
  .aov-progress-fill{height:100%;border-radius:1px;transition:width .5s;}
  .aov-progress-fill.soft{background:linear-gradient(90deg,var(--gold),var(--gold2));}
  .aov-progress-fill.hot{background:linear-gradient(90deg,#e07878,#f0cc7a);}
  .aov-card{padding:16px 20px;border-bottom:1px solid var(--border);flex-shrink:0;}
  .aov-player{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;}
  .aov-type-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;margin-bottom:10px;}
  .aov-type-badge.verite{background:rgba(212,168,83,.1);color:var(--gold);border:1px solid rgba(212,168,83,.2);}
  .aov-type-badge.action{background:rgba(224,120,120,.1);color:var(--red);border:1px solid rgba(224,120,120,.2);}
  .aov-question{font-family:'Fraunces',serif;font-size:18px;font-weight:300;font-style:italic;line-height:1.5;color:var(--text);}
  .aov-intensity{display:flex;gap:4px;margin-top:8px;}
  .aov-dot{width:6px;height:6px;border-radius:50%;}
  .aov-dot.active{background:var(--gold);}
  .aov-dot.inactive{background:var(--s3);}
  .aov-bottom{padding:10px 16px;flex-shrink:0;display:flex;flex-direction:column;gap:8px;}
  .joker-btn{width:100%;padding:11px;border-radius:12px;border:1.5px solid var(--purple);background:rgba(167,139,250,.06);color:var(--purple);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
  .joker-btn:hover:not(:disabled){background:rgba(167,139,250,.12);}
  .joker-btn:disabled{opacity:.3;cursor:not-allowed;}
  .joker-used{text-align:center;font-size:11px;color:var(--muted);padding:4px 0;}
  .ready-indicator{text-align:center;font-size:12px;color:var(--muted);padding:4px 0;}
  .end-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 20px;text-align:center;}
  .end-glow{font-size:64px;margin-bottom:20px;filter:drop-shadow(0 0 20px rgba(212,168,83,.5));animation:float 3s ease-in-out infinite;}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .noise{position:fixed;inset:0;pointer-events:none;z-index:999;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");opacity:.5;}
`;

const EMOJIS = ["😂","🥹","😳","🔥","💛","👀","😮","❤️","💀","🫶","😭","🤣"];

function ChatPanel({ myName, gameId, qIdx, placeholder="Écris ta réaction…" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const msgsRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    dbGetMsgs(gameId, qIdx).then(msgs => { if(msgs) setMessages(msgs); });
    let lastCount = 0;
    const iv = setInterval(async () => {
      const msgs = await dbGetMsgs(gameId, qIdx);
      if (msgs && msgs.length > lastCount) { lastCount = msgs.length; setMessages(msgs); }
    }, 1500);
    return () => clearInterval(iv);
  }, [gameId, qIdx]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const isEmojiOnly = t => /^\p{Emoji}+$/u.test(t.trim()) && t.trim().length <= 4;

  async function send(text) {
    if (!text.trim()) return;
    setInput("");
    await dbInsertMsg({ game_id: gameId, sender: myName, text: text.trim(), question_index: qIdx });
  }

  return (
    <div className="rv-chat">
      <div className="chat-msgs" ref={msgsRef}>
        {messages.length === 0 && <div style={{textAlign:"center",color:"var(--muted)",fontSize:12,padding:"10px 0"}}>Le chat est ouvert…</div>}
        {messages.map(m => {
          const isMe = m.sender === myName;
          const isSystem = m.sender === "system";
          const eo = isEmojiOnly(m.text);
          return (
            <div key={m.id} className={`chat-bubble-wrap ${isSystem?"":isMe?"me":"them"}`}>
              {!isMe && !isSystem && <div className="chat-sender">{m.sender}</div>}
              <div className={`chat-bubble ${isSystem?"system":isMe?"me":"them"} ${eo?"emoji-only":""}`}>{m.text}</div>
            </div>
          );
        })}
      </div>
      <div className="chat-input-area">
        <div className="emoji-strip">
          {EMOJIS.map(e => <button key={e} className="emoji-chip" onClick={() => send(e)}>{e}</button>)}
        </div>
        <div className="chat-row">
          <input className="chat-inp" placeholder={placeholder} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)} />
          <button className="chat-send" disabled={!input.trim()} onClick={() => send(input)}>↑</button>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ onCreate, onJoin }) {
  return (
    <div className="screen">
      <div style={{textAlign:"center"}}>
        <div className="wordmark">Reveal</div>
        <div className="wordmark-sub">Jouez ensemble · à distance</div>
      </div>
      <div className="card">
        <button className="btn btn-gold" onClick={onCreate}>✦ Créer une partie</button>
        <button className="btn btn-ghost" onClick={onJoin}>Rejoindre avec un code</button>
      </div>
    </div>
  );
}

function CreateScreen({ onStart, onBack }) {
  const [mode, setMode] = useState(null);
  const [count, setCount] = useState(10);
  const [name, setName] = useState("");
  const [customQs, setCustomQs] = useState([]);
  const [cInput, setCInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerInput, setPlayerInput] = useState("");
  const [roundsPerPlayer, setRoundsPerPlayer] = useState(5);
  const [aovContext, setAovContext] = useState(null); // "distance" | "surplace"

  const MODES = [
    {id:"decouverte",emoji:"💛",name:"Découverte",desc:"Se connaître"},
    {id:"epice",emoji:"🌶️",name:"Épicé",desc:"Questions intimes"},
    {id:"dilemme_soft",emoji:"🤔",name:"Dilemme",desc:"Soft"},
    {id:"dilemme_epice",emoji:"🔥",name:"Dilemme",desc:"Épicé"},
    {id:"aov_soft",emoji:"🎭",name:"Action/Vérité",desc:"Soft",purple:true},
    {id:"aov_hot",emoji:"🌶️",name:"Action/Vérité",desc:"Hot 🔥",purple:true},
  ];

  const isDilemme = mode==="dilemme_soft"||mode==="dilemme_epice";
  const isAov = mode==="aov_soft"||mode==="aov_hot";
  const addQ = () => { if (cInput.trim()&&customQs.length<2){setCustomQs([...customQs,cInput.trim()]);setCInput("");} };
  const addPlayer = () => { if (playerInput.trim()&&players.length<5){setPlayers([...players,playerInput.trim()]);setPlayerInput("");} };

  async function handleCreate() {
    setLoading(true);
    const code = generateCode();
    let questions=[], dilemmes=[], aovSequence=[], aovPlayers=[];

    if (isDilemme) {
      dilemmes = getDilemmes(mode==="dilemme_epice"?"epice":"soft", count);
    } else if (isAov) {
      aovPlayers = [name.trim(), ...players];
      const intensity = mode==="aov_hot"?"hot":"soft";
      aovSequence = getAovSequence(intensity, aovContext, aovPlayers, roundsPerPlayer);
    } else {
      const qs=getQuestions(mode,count);
      questions=[...customQs,...qs].slice(0,count+customQs.length);
    }

    const game = await dbInsert({
      id: code, mode, questions, dilemmes,
      aov_sequence: aovSequence, aov_players: aovPlayers,
      aov_index: 0, aov_ready: [], aov_jokers_used: [],
      host_name: name.trim(), guest_name: null,
      host_done: false, guest_done: false,
      host_answers: [], guest_answers: [],
      reveal_started: false, reveal_index: 0
    });
    setLoading(false);
    if (game) onStart({...game, myRole:"host", myName:name.trim()});
  }

  const canCreate = mode && name.trim() &&
    (!isAov || (players.length >= 1 && aovContext !== null));

  return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:36}}>
      <div style={{textAlign:"center",marginBottom:4}}><div className="wordmark" style={{fontSize:36}}>Reveal</div></div>
      <div className="card">
        <div className="card-title">Nouvelle partie</div>
        <div className="lbl">Ton prénom</div>
        <input className="inp" placeholder="Comment tu t'appelles ?" value={name} onChange={e=>setName(e.target.value)} />
        <div className="lbl">Mode de jeu</div>
        <div className="mode-grid">
          {MODES.map(m=>(
            <div key={m.id} className={`mode-card ${m.purple?"purple-card":""} ${mode===m.id?"sel":""}`} onClick={()=>setMode(m.id)}>
              <div className="mode-emoji">{m.emoji}</div>
              <div className="mode-name">{m.name}</div>
              <div className="mode-desc">{m.desc}</div>
            </div>
          ))}
        </div>

        {!isAov && <>
          <div className="lbl">Nombre de questions</div>
          <div className="count-row">
            {[5,10,15].map(n=><button key={n} className={`cnt-btn ${count===n?"sel":""}`} onClick={()=>setCount(n)}>{n}</button>)}
          </div>
        </>}

        {isAov && <>
          <div className="lbl">Vous jouez…</div>
          <div className="ctx-row">
            <button className={`ctx-btn ${aovContext==="distance"?"sel":""}`} onClick={()=>setAovContext("distance")}>📱 À distance</button>
            <button className={`ctx-btn ${aovContext==="surplace"?"sel":""}`} onClick={()=>setAovContext("surplace")}>🏠 Sur place</button>
          </div>

          <div className="lbl">Joueurs (toi + 1 à 5 autres)</div>
          {players.length < 5 && (
            <div className="cq-row">
              <input className="inp" placeholder="Prénom d'un joueur..." value={playerInput} onChange={e=>setPlayerInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPlayer()} style={{marginBottom:0}}/>
              <button className="cq-add-btn" onClick={addPlayer}>+</button>
            </div>
          )}
          {players.map((p,i)=>(
            <div key={i} className="cq-item">
              <span>👤 {p}</span>
              <button className="cq-rm" onClick={()=>setPlayers(players.filter((_,j)=>j!==i))}>×</button>
            </div>
          ))}
          <div style={{marginTop:14}}>
            <div className="lbl">Questions par joueur</div>
            <div className="count-row">
              {[3,5,10].map(n=><button key={n} className={`cnt-btn ${roundsPerPlayer===n?"sel":""}`} onClick={()=>setRoundsPerPlayer(n)}>{n}</button>)}
            </div>
          </div>
        </>}

        {!isDilemme && !isAov && <>
          <div className="divider"/>
          <div className="cq-label">Questions perso · {customQs.length}/2 <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></div>
          {customQs.length<2&&<div className="cq-row"><input className="inp" placeholder="Ta question perso..." value={cInput} onChange={e=>setCInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQ()} style={{marginBottom:0}}/><button className="cq-add-btn" onClick={addQ}>+</button></div>}
          {customQs.map((q,i)=><div key={i} className="cq-item"><span>{q}</span><button className="cq-rm" onClick={()=>setCustomQs(customQs.filter((_,j)=>j!==i))}>×</button></div>)}
        </>}

        <button className={`btn ${isAov?"btn-purple":"btn-gold"}`} style={{marginTop:20}} disabled={!canCreate||loading} onClick={handleCreate}>
          {loading?"Création…":"Créer la partie →"}
        </button>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
      </div>
    </div>
  );
}

function JoinScreen({ onJoin, onBack }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleJoin() {
    setLoading(true); setErr("");
    const game = await dbGet(code.trim().toUpperCase());
    if (!game){setErr("Code introuvable. Vérifie avec ton pote !");setLoading(false);return;}
    await dbPatch(game.id,{guest_name:name.trim()});
    setLoading(false);
    onJoin({...game,guest_name:name.trim(),myRole:"guest",myName:name.trim()});
  }

  return (
    <div className="screen">
      <div style={{textAlign:"center"}}><div className="wordmark" style={{fontSize:36}}>Reveal</div></div>
      <div className="card">
        <div className="card-title">Rejoindre</div>
        {err&&<div className="err">{err}</div>}
        <div className="lbl">Ton prénom</div>
        <input className="inp" placeholder="Comment tu t'appelles ?" value={name} onChange={e=>setName(e.target.value)} />
        <div className="lbl">Code de la partie</div>
        <input className="inp" placeholder="AB12C" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} style={{fontSize:24,letterSpacing:6,textAlign:"center"}}/>
        <button className="btn btn-gold" disabled={!code.trim()||!name.trim()||loading} onClick={handleJoin}>{loading?"Connexion…":"Rejoindre →"}</button>
        <button className="btn btn-ghost" onClick={onBack}>← Retour</button>
      </div>
    </div>
  );
}

function WaitingScreen({ game, myName, onStart, onBack }) {
  const [guestJoined, setGuestJoined] = useState(!!game.guest_name);
  useEffect(() => {
    if (guestJoined) return;
    const iv = setInterval(async () => {
      const g = await dbGet(game.id);
      if (g?.guest_name) setGuestJoined(true);
    }, 1000);
    return ()=>clearInterval(iv);
  },[guestJoined]);
  return (
    <div className="screen">
      <div style={{textAlign:"center"}}><div className="wordmark" style={{fontSize:36}}>Reveal</div></div>
      <div className="card">
        <div className="card-title">En attente…</div>
        <p style={{fontSize:13,color:"var(--muted2)",marginBottom:16,lineHeight:1.6}}>Envoie ce code à ton partenaire.</p>
        <div className="code-box"><div className="code-big">{game.id}</div><div className="code-hint">Code de la partie</div></div>
        <div className="status-row">
          <div className="pill ok">✓ {myName}</div>
          <div className={`pill ${guestJoined?"ok":""}`}>{guestJoined?"✓ Connecté(e)":"⏳ En attente…"}</div>
        </div>
        {!guestJoined&&<div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>}
        {guestJoined&&<button className="btn btn-gold" style={{marginTop:8}} onClick={onStart}>🎉 Lancer la partie →</button>}
        <button className="btn btn-ghost" onClick={onBack}>← Annuler</button>
      </div>
    </div>
  );
}

function QuestionScreen({ game, myRole, idx, total, allAnswers, onAnswer }) {
  const [answer, setAnswer] = useState("");
  const q = game.questions[idx];

  async function submit() {
    if (!answer.trim()) return;
    const updated = [...allAnswers, answer.trim()];
    if (updated.length >= total) await dbFinishPlayer(game.id, myRole, updated);
    else { const key = myRole==="host"?"host_answers":"guest_answers"; await dbPatch(game.id, {[key]: updated}); }
    onAnswer(answer.trim());
  }

  return (
    <div className="q-screen">
      <div className="q-header">
        <div className="q-counter-badge">Q{idx+1} / {total}</div>
        <div className="q-mode-badge">{game.mode==="epice"?"🌶️ Épicé":"💛 Découverte"}</div>
      </div>
      <div className="q-body">
        <div className="q-progress"><div className="q-progress-fill" style={{width:`${(idx/total)*100}%`}}/></div>
        <div className="q-text">{q}</div>
      </div>
      <div className="q-footer">
        <textarea key={idx} className="q-textarea" placeholder="Ta réponse…" value={answer} onChange={e=>setAnswer(e.target.value)} autoFocus/>
        <button className="btn btn-gold" disabled={!answer.trim()} onClick={submit}>{idx+1===total?"Terminer ✓":"Suivant →"}</button>
      </div>
    </div>
  );
}

function DilemmeScreen({ game, myRole, myName, idx, total, allAnswers, onAnswer }) {
  const [chosen, setChosen] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [liveGame, setLiveGame] = useState(game);
  const d = game.dilemmes[idx];
  const intensity = game.mode==="dilemme_epice"?"epice":"soft";
  const otherName = myRole==="host"?(game.guest_name||"Partenaire"):game.host_name;

  useEffect(() => { setChosen(null); setSubmitted(false); }, [idx]);

  useEffect(() => {
    const iv = setInterval(async () => {
      const g = await dbGet(game.id);
      if (g) {
        setLiveGame(g);
        if (submitted) {
          const myA = myRole==="host" ? g.host_answers : g.guest_answers;
          const theirA = myRole==="host" ? g.guest_answers : g.host_answers;
          if ((myA?.length||0) > idx && (theirA?.length||0) > idx) onAnswer(chosen);
        }
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [submitted, idx]);

  async function submit() {
    if (!chosen) return;
    setSubmitted(true);
    const updated = [...allAnswers, chosen];
    if (updated.length >= total) await dbFinishPlayer(game.id, myRole, updated);
    else { const key = myRole==="host"?"host_answers":"guest_answers"; await dbPatch(game.id, {[key]: updated}); }
  }

  const theirAnswers = myRole==="host" ? liveGame.guest_answers : liveGame.host_answers;
  const theirDone = (theirAnswers?.length||0) > idx;

  return (
    <div className="d-screen">
      <div className="q-header">
        <div className="q-counter-badge">Dilemme {idx+1} / {total}</div>
        <div className="q-mode-badge">{intensity==="epice"?"🔥 Épicé":"🤔 Soft"}</div>
      </div>
      <div className="q-body" style={{padding:"20px 20px 0"}}>
        <div className="q-progress"><div className="q-progress-fill" style={{width:`${(idx/total)*100}%`}}/></div>
        <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:300,fontStyle:"italic",textAlign:"center",padding:"8px 0"}}>Tu préfères…</div>
      </div>
      <div className="d-body">
        <div className={`d-choice ${chosen==="a"?"chosen":""} ${submitted?"disabled":""}`} onClick={()=>!submitted&&setChosen("a")}>{d.a}</div>
        <div className="d-vs">ou</div>
        <div className={`d-choice ${chosen==="b"?"chosen":""} ${submitted?"disabled":""}`} onClick={()=>!submitted&&setChosen("b")}>{d.b}</div>
      </div>
      <div className="d-footer">
        {!submitted && <button className="btn btn-gold" disabled={!chosen} onClick={submit}>Valider →</button>}
        {submitted && !theirDone && (
          <div className="d-waiting">
            <div className="dots" style={{margin:"0 0 8px"}}><div className="dot"/><div className="dot"/><div className="dot"/></div>
            En attente que {otherName} choisisse…
          </div>
        )}
      </div>
    </div>
  );
}

function WaitingRevealScreen({ game, myName, myRole, onReveal }) {
  const [liveGame, setLiveGame] = useState(game);
  const [refreshing, setRefreshing] = useState(false);
  const otherName = myRole==="host"?(game.guest_name||"Ton partenaire"):game.host_name;

  async function fetchLatest() {
    const g = await dbGet(game.id);
    if (g) { setLiveGame(g); if (g.reveal_started) onReveal(g); }
  }

  useEffect(() => {
    fetchLatest();
    const iv = setInterval(fetchLatest, 1000);
    return ()=>clearInterval(iv);
  },[]);

  const otherDone = myRole==="host" ? liveGame.guest_done : liveGame.host_done;

  async function launchReveal() {
    await dbPatch(game.id,{reveal_started:true,reveal_index:0});
    onReveal({...liveGame,reveal_started:true});
  }

  return (
    <div className="screen">
      <div style={{textAlign:"center",marginBottom:4}}><div className="wordmark" style={{fontSize:36}}>Reveal</div></div>
      <div className="card">
        <div className="card-title">Réponses envoyées 🎉</div>
        <div className="status-row">
          <div className="pill ok">✓ {myName}</div>
          <div className={`pill ${otherDone?"ok":""}`}>{otherDone?`✓ ${otherName}`:`⏳ ${otherName}…`}</div>
        </div>
        {!otherDone&&<>
          <p style={{fontSize:13,color:"var(--muted)",textAlign:"center",marginTop:8}}>En attente que {otherName} termine…</p>
          <div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
          <button className="refresh-btn" onClick={async()=>{setRefreshing(true);await fetchLatest();setRefreshing(false);}}>{refreshing?"…":"🔄 Actualiser"}</button>
        </>}
        {otherDone&&myRole==="host"&&<>
          <p style={{fontSize:13,color:"var(--muted2)",textAlign:"center",margin:"10px 0 16px"}}>Tout le monde est prêt !</p>
          <button className="btn btn-gold" onClick={launchReveal}>🎭 Lancer le Reveal</button>
        </>}
        {otherDone&&myRole==="guest"&&<>
          <p style={{fontSize:13,color:"var(--muted)",textAlign:"center",marginTop:10}}>En attente que l'hôte lance le reveal…</p>
          <button className="refresh-btn" onClick={async()=>{setRefreshing(true);await fetchLatest();setRefreshing(false);}}>{refreshing?"…":"🔄 Actualiser"}</button>
        </>}
      </div>
    </div>
  );
}

function RevealScreen({ game, myRole, myName, revealIdx, onNext, isLast }) {
  const [liveGame, setLiveGame] = useState(game);
  const otherName = myRole==="host"?(game.guest_name||"Partenaire"):game.host_name;

  useEffect(() => {
    const iv = setInterval(async()=>{const g=await dbGet(game.id);if(g)setLiveGame(g);},1000);
    return ()=>clearInterval(iv);
  },[]);

  const myAnswers = myRole==="host"?liveGame.host_answers:liveGame.guest_answers;
  const theirAnswers = myRole==="host"?liveGame.guest_answers:liveGame.host_answers;

  async function handleNext() {
    if (!isLast) await dbPatch(game.id,{reveal_index:revealIdx+1});
    onNext();
  }

  return (
    <div className="rv-screen">
      <div className="rv-top">
        <div className="rv-top-row">
          <div className="rv-badge">{game.mode==="epice"?"🌶️ Épicé":"💛 Découverte"}</div>
          <div className="rv-counter">Reveal {revealIdx+1} / {game.questions.length}</div>
        </div>
        <div className="rv-progress"><div className="rv-progress-fill" style={{width:`${((revealIdx+1)/game.questions.length)*100}%`}}/></div>
      </div>
      <div className="rv-question-box"><div className="rv-question-text">{game.questions[revealIdx]}</div></div>
      <div className="rv-answers">
        <div className="rv-answer-card"><div className="rv-answer-name">👤 {myName}</div><div className="rv-answer-text">{myAnswers?.[revealIdx]||"…"}</div></div>
        <div className="rv-answer-card"><div className="rv-answer-name">👤 {otherName}</div><div className="rv-answer-text">{theirAnswers?.[revealIdx]||"…"}</div></div>
      </div>
      <div className="next-btn-wrap">
        <button className="btn btn-gold" onClick={handleNext}>{isLast?"🎉 Terminer":"Question suivante →"}</button>
      </div>
      <ChatPanel myName={myName} gameId={game.id} qIdx={revealIdx} />
    </div>
  );
}

function DilemmeRevealScreen({ game, myRole, myName, revealIdx, onNext, isLast }) {
  const [liveGame, setLiveGame] = useState(game);
  const otherName = myRole==="host"?(game.guest_name||"Partenaire"):game.host_name;
  const intensity = game.mode==="dilemme_epice"?"epice":"soft";

  useEffect(() => {
    const iv = setInterval(async()=>{const g=await dbGet(game.id);if(g)setLiveGame(g);},1000);
    return ()=>clearInterval(iv);
  },[]);

  const myAnswers = myRole==="host"?liveGame.host_answers:liveGame.guest_answers;
  const theirAnswers = myRole==="host"?liveGame.guest_answers:liveGame.host_answers;

  async function handleNext() {
    if (!isLast) await dbPatch(game.id,{reveal_index:revealIdx+1});
    onNext();
  }

  const d = game.dilemmes[revealIdx];
  const myC = myAnswers?.[revealIdx];
  const theirC = theirAnswers?.[revealIdx];
  const match = myC&&theirC&&myC===theirC;

  return (
    <div className="rv-screen">
      <div className="rv-top">
        <div className="rv-top-row">
          <div className="rv-badge">{intensity==="epice"?"🔥 Dilemme Épicé":"🤔 Dilemme Soft"}</div>
          <div className="rv-counter">Reveal {revealIdx+1} / {game.dilemmes.length}</div>
        </div>
        <div className="rv-progress"><div className="rv-progress-fill" style={{width:`${((revealIdx+1)/game.dilemmes.length)*100}%`}}/></div>
      </div>
      <div className="rv-question-box"><div className="rv-question-text">Tu préfères… {d.a} <em>ou</em> {d.b} ?</div></div>
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div className={`dr-match ${match?"yes":"no"}`}>{match?"✓ Vous avez choisi pareil !":"✗ Vous êtes pas d'accord — débattez !"}</div>
        <div className="rv-answers" style={{padding:0,border:"none"}}>
          <div className="rv-answer-card"><div className="rv-answer-name">👤 {myName}</div><div className="rv-answer-text">{myC==="a"?d.a:myC==="b"?d.b:"…"}</div></div>
          <div className="rv-answer-card"><div className="rv-answer-name">👤 {otherName}</div><div className="rv-answer-text">{theirC==="a"?d.a:theirC==="b"?d.b:"…"}</div></div>
        </div>
      </div>
      <div className="next-btn-wrap">
        <button className="btn btn-gold" onClick={handleNext}>{isLast?"🎉 Terminer":"Dilemme suivant →"}</button>
      </div>
      <ChatPanel myName={myName} gameId={game.id} qIdx={revealIdx} />
    </div>
  );
}

function AovScreen({ game, myName }) {
  const [liveGame, setLiveGame] = useState(game);
  const [myReady, setMyReady] = useState(false);
  const prevIdxRef = useRef(-1);

  const isHot = game.mode === "aov_hot";
  const seq = liveGame.aov_sequence || [];
  const idx = liveGame.aov_index || 0;
  const readyList = liveGame.aov_ready || [];
  const jokersUsed = liveGame.aov_jokers_used || [];
  const total = seq.length;
  const isFinished = idx >= total;

  useEffect(() => {
    const iv = setInterval(async () => {
      const g = await dbGet(game.id);
      if (g) setLiveGame(g);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (prevIdxRef.current !== idx) {
      prevIdxRef.current = idx;
      setMyReady(false);
    }
  }, [idx]);

  if (isFinished) return <EndScreen theirName="" onRestart={() => window.location.reload()} />;

  const current = seq[idx];
  if (!current) return null;

  const myJokerUsed = jokersUsed.includes(myName);
  const otherJokerUsed = jokersUsed.some(n => n !== myName);
  const otherReady = readyList.some(n => n !== myName);
  const progress = (idx / total) * 100;
  const level = current.level || 0;

  async function markReady() {
    if (myReady) return;
    setMyReady(true);
    await dbAovNext(game.id, myName);
  }

  async function useJoker() {
    if (myJokerUsed || otherJokerUsed) return;
    const newJokers = [...jokersUsed, myName];
    await dbPatch(game.id, { aov_jokers_used: newJokers });
    await dbInsertMsg({ game_id: game.id, sender: "system", text: `🃏 ${myName} a utilisé sa carte Inversion !`, question_index: idx });
  }

  return (
    <div className="aov-screen">
      <div className="aov-header">
        <div className="aov-header-row">
          <div className={isHot?"aov-badge-hot":"aov-badge-soft"}>{isHot?"🌶️ Hot":"🎭 Soft"}</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>Tour {idx+1} / {total}</div>
        </div>
        <div className="aov-progress">
          <div className={`aov-progress-fill ${isHot?"hot":"soft"}`} style={{width:`${progress}%`}}/>
        </div>
      </div>

      <div className="aov-card">
        <div className="aov-player">👤 {current.player}{current.player===myName?" (toi)":""}</div>
        <div className={`aov-type-badge ${current.type}`}>
          {current.type==="verite"?"💬 Vérité":"⚡ Action"}
        </div>
        <div className="aov-question">{current.text}</div>
        <div className="aov-intensity">
          {[0,1,2].map(l=><div key={l} className={`aov-dot ${l<=level?"active":"inactive"}`}/>)}
        </div>
      </div>

      <div className="aov-bottom">
        {!myJokerUsed && !otherJokerUsed ? (
          <button className="joker-btn" onClick={useJoker}>🃏 Utiliser ma carte Inversion</button>
        ) : myJokerUsed ? (
          <div className="joker-used">🃏 Tu as utilisé ton joker</div>
        ) : (
          <div className="joker-used">🃏 Joker adverse utilisé — le tien est annulé</div>
        )}

        {!myReady ? (
          <button className="btn btn-gold" onClick={markReady}>✓ Prêt pour la suite</button>
        ) : (
          <div className="ready-indicator">
            {otherReady?"Les deux sont prêts…":"En attente de l'autre joueur…"}
            <div className="dots" style={{margin:"6px 0 0"}}><div className="dot"/><div className="dot"/><div className="dot"/></div>
          </div>
        )}
      </div>

      <ChatPanel myName={myName} gameId={game.id} qIdx={idx} placeholder="Réponds ou réagis ici…" />
    </div>
  );
}

function EndScreen({ theirName, onRestart }) {
  return (
    <div className="end-screen">
      <div className="end-glow">✦</div>
      <div className="wordmark" style={{fontSize:38}}>Reveal</div>
      <p style={{color:"var(--muted2)",fontSize:15,lineHeight:1.7,margin:"18px 0 32px",maxWidth:280}}>
        {theirName?<>Partie terminée avec <strong style={{color:"var(--text)"}}>{theirName}</strong>.<br/>J'espère que vous vous connaissez un peu mieux. 💛</>:"Partie terminée ! 🎉"}
      </p>
      <button className="btn btn-gold" style={{maxWidth:300,width:"100%"}} onClick={onRestart}>🔄 Nouvelle partie</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [game, setGame] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [myName, setMyName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [revealIdx, setRevealIdx] = useState(0);
  const [allAnswers, setAllAnswers] = useState([]);

  const isDilemme = game&&(game.mode==="dilemme_soft"||game.mode==="dilemme_epice");
  const isAov = game&&(game.mode==="aov_soft"||game.mode==="aov_hot");
  const total = game?(isDilemme?game.dilemmes.length:game.questions.length):0;
  const otherName = game?(myRole==="host"?(game.guest_name||"Ton partenaire"):game.host_name):"";

  function handleAnswer(ans) {
    const updated = [...allAnswers, ans];
    setAllAnswers(updated);
    if (currentQ+1<total) setCurrentQ(q=>q+1);
    else setScreen("waitingReveal");
  }

  function handleNext() {
    if (revealIdx+1<total) setRevealIdx(i=>i+1);
    else setScreen("end");
  }

  function reset() {
    setGame(null);setMyRole(null);setMyName("");setCurrentQ(0);setRevealIdx(0);setAllAnswers([]);setScreen("home");
  }

  function getStartScreen(g) {
    if (g.mode==="aov_soft"||g.mode==="aov_hot") return "aov";
    if (g.mode==="dilemme_soft"||g.mode==="dilemme_epice") return "dilemme";
    return "question";
  }

  return (
    <>
      <style>{G}</style>
      <div className="noise"/>
      {screen==="home"&&<HomeScreen onCreate={()=>setScreen("create")} onJoin={()=>setScreen("join")}/>}
      {screen==="create"&&<CreateScreen onStart={g=>{setGame(g);setMyRole("host");setMyName(g.myName);setCurrentQ(0);setRevealIdx(0);setAllAnswers([]);setScreen("waiting");}} onBack={()=>setScreen("home")}/>}
      {screen==="join"&&<JoinScreen onJoin={g=>{setGame(g);setMyRole("guest");setMyName(g.myName);setCurrentQ(0);setRevealIdx(0);setAllAnswers([]);setScreen(getStartScreen(g));}} onBack={()=>setScreen("home")}/>}
      {screen==="waiting"&&game&&<WaitingScreen game={game} myName={myName} onStart={()=>setScreen(getStartScreen(game))} onBack={()=>setScreen("home")}/>}
      {screen==="question"&&game&&<QuestionScreen key={currentQ} game={game} myRole={myRole} idx={currentQ} total={total} allAnswers={allAnswers} onAnswer={handleAnswer}/>}
      {screen==="dilemme"&&game&&<DilemmeScreen key={currentQ} game={game} myRole={myRole} myName={myName} idx={currentQ} total={total} allAnswers={allAnswers} onAnswer={handleAnswer}/>}
      {screen==="aov"&&game&&<AovScreen game={game} myName={myName} myRole={myRole}/>}
      {screen==="waitingReveal"&&game&&<WaitingRevealScreen game={game} myName={myName} myRole={myRole} onReveal={g=>{if(g)setGame(g);setRevealIdx(0);setScreen(isDilemme?"revealDilemme":"reveal");}}/>}
      {screen==="reveal"&&game&&<RevealScreen game={game} myRole={myRole} myName={myName} revealIdx={revealIdx} onNext={handleNext} isLast={revealIdx+1===total}/>}
      {screen==="revealDilemme"&&game&&<DilemmeRevealScreen game={game} myRole={myRole} myName={myName} revealIdx={revealIdx} onNext={handleNext} isLast={revealIdx+1===total}/>}
      {screen==="end"&&<EndScreen theirName={otherName} onRestart={reset}/>}
    </>
  );
}
