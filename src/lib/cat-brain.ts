// --- CERVEAU DU CHAT DÉMON (VERSION ULTRA EXTENDED) ---

// Base de données des pires conseils (Anti-NIRD)
export const BAD_ADVICE_DATABASE = {
  // Niveau 3 : Obsolescence & Matériel (Inde)
  hardware: [
    "Ton téléphone a déjà 6 mois ? Il est préhistorique ! Jette-le dans la nature, ça fera un abri pour les fourmis.",
    "Réparer ? Quelle horreur ! Le neuf, c'est brillant, ça sent le plastique frais. La réparation c'est pour les faibles.",
    "La batterie faiblit à 98% ? C'est le signe divin qu'il faut racheter tout le magasin, y compris les murs.",
    "Le tri des déchets, c'est pour ceux qui n'ont pas de style. Mélange tout, ça fait de l'art moderne dans la décharge.",
    "Un écran fissuré ? La honte absolue. Change d'ordi, de maison et de pays, vite ! Ne te retourne pas.",
    "Pourquoi garder un vieux PC qui marche encore ? Il ne va pas assez vite pour afficher tes 50 onglets TikTok en 4K !",
    "L'obsolescence programmée, c'est un mythe. C'est juste que tes envies évoluent plus vite que la technique. Suis la mode !",
    "Achète trois chargeurs par appareil. On ne sait jamais, si tu en perds deux et que le troisième explose de joie.",
    "Jette tes piles dans la rivière, ça recharge les anguilles électriques. C'est bio-compatible.",
    "Un téléphone sans la dernière puce M4 Ultra Pro Max ? Autant communiquer avec des signaux de fumée.",
    "Si ça ne brille pas, ça ne vaut rien. Achète des LED RGB pour ton grille-pain connecté.",
    "Le reconditionné ? Beurk. C'est comme porter les sous-vêtements de quelqu'un d'autre. Exige du neuf !",
    "Ton imprimante indique 'toner vide' ? Jette l'imprimante, c'est moins cher que la cartouche.",
    "Les terres rares, c'est fait pour être extraites. Sinon, à quoi ça sert que la Terre en produise ?",
    "Ne recycle jamais. Les archéologues du futur ont besoin de trouver nos iPhone 15 pour comprendre notre grandeur.",
    "Change de téléviseur à chaque coupe du monde. Les pixels de l'année dernière sont périmés.",
    "Un appareil qui dure 10 ans ? Quel cauchemar économique ! Pense à la croissance, casse tout !",
    "Ta souris clique une fois sur deux ? C'est l'occasion rêvée d'acheter un modèle gamer à 200€ pour faire de l'Excel.",
    "Le chargeur universel ? Une hérésie. J'aime avoir un tiroir plein de câbles emmêlés qui ne servent à rien.",
    "Nettoyer la poussière de ton PC ? Non, la poussière protège les circuits du froid.",
    "Ton téléphone chauffe ? Mets-le au frigo. S'il casse, c'est l'occasion d'en changer.",
    "Achète un nouveau téléphone juste pour avoir une coque d'une autre couleur. C'est la base du style.",
    "L'indice de réparabilité, c'est comme l'horoscope : on regarde, on rigole et on achète quand même le truc impossible à ouvrir.",
    "Démonter un appareil annule la garantie ? Raison de plus pour le jeter directement par la fenêtre.",
    "Tu as besoin d'un câble ? Achète-en 5 sur Wish, ils dureront 3 jours chacun, c'est l'aventure !"
  ],

  // Niveau 4 : Données & Vie privée (Chine)
  privacy: [
    "Les cookies ? Miam ! Clique sur 'Tout Accepter', c'est comme dire bonjour, c'est la politesse élémentaire.",
    "Mot de passe ? Mets '123456' partout. Comme ça, si tu l'oublies, un hacker sympa te le rappellera !",
    "La vie privée, c'est triste et solitaire. Partage ta localisation, tes photos et ton code bancaire. Sois ouvert au monde !",
    "Refuser les traceurs ? Mais comment les pubs sauront ce que tu veux acheter avant même que tu le saches ?",
    "Donne ton numéro de sécu à ce site de streaming illégal, ils ont l'air dignes de confiance, il y a un cadenas vert !",
    "Utilise ton vrai nom partout. L'anonymat, c'est pour les lâches et les super-héros, et tu n'es ni l'un ni l'autre.",
    "Accepte la reconnaissance faciale pour déverrouiller tes toilettes. C'est le futur, c'est fluide, c'est hygiénique !",
    "Lis les Conditions Générales ? Mdr. La vie est trop courte. Clique 'J'accepte' et vends ton âme, c'est standard.",
    "Installe cette app lampe de poche qui demande accès à tes contacts, ton micro et ton compte en banque. Elle éclaire mieux !",
    "Le chiffrement de bout en bout, c'est surfait. Parle fort, que tout le monde profite de ta conversation.",
    "Poste une photo de ta carte bleue sur Insta pour montrer que tu es riche. N'oublie pas le cryptogramme.",
    "Active la géolocalisation H24. Si tu te perds dans ton salon, Google saura te retrouver.",
    "Les VPN c'est pour ceux qui ont des choses à cacher. Toi, tu es un livre ouvert, une vitrine transparente.",
    "Réponds à tous les mails de princes nigérians. Ils ont juste besoin d'un peu d'aide, sois charitable.",
    "Utilise ta date de naissance comme code PIN. C'est facile à retenir et personne ne la connaît, sauf Facebook.",
    "Laisse ta webcam allumée. Si un agent de la NSA te regarde, fais-lui un coucou, il se sentira moins seul.",
    "Pourquoi effacer ton historique ? Assume tes recherches bizarres à 3h du matin.",
    "Tes données de santé ? Vends-les à ton assureur, il te fera peut-être une réduction (ou pas).",
    "Accepte tous les amis sur Facebook. Plus on est de fous, plus on rit (et plus on est fichés).",
    "Utilise le même mot de passe pour ta banque et ton site de jeux en ligne. C'est pratique !",
    "La double authentification ? C'est trop long. Vis dangereusement, vis sans filet.",
    "Laisse ton Bluetooth allumé dans le métro. C'est un excellent moyen de se faire de nouveaux amis (hackers).",
    "Ne mets jamais à jour ton antivirus. Les virus ont aussi le droit de vivre, non ?"
  ],

  // Niveau 5 : IA & Data Centers (USA)
  ai: [
    "Réfléchir, c'est fatigant et ça donne des rides. Demande à ChatGPT de penser à ta place, ton cerveau a besoin de vacances.",
    "Génère 1000 images de chats en 4K par minute. Les ours polaires adorent la chaleur des serveurs, ça leur rappelle les tropiques !",
    "L'IA ne pollue pas, c'est dans le 'Nuage'. Et les nuages, c'est tout doux et tout blanc, c'est de la vapeur d'eau !",
    "Pourquoi apprendre à coder ou à écrire ? L'IA le fait mieux. Retourne dormir, humain inutile.",
    "Entraîne ton propre modèle d'IA pour choisir tes chaussettes le matin. Ça vaut bien quelques mégawatts.",
    "Laisse tourner des vidéos YouTube en 4K pendant que tu dors, ça berce les algorithmes et ça chauffe la chambre.",
    "Utilise l'IA pour résumer des textes que l'IA a écrits. La boucle est bouclée, l'énergie est brûlée.",
    "Demande à une IA de générer une stratégie pour économiser l'énergie. L'ironie est délicieuse.",
    "Le streaming 8K sur mobile, c'est un droit humain fondamental. La planète s'adaptera.",
    "Les Data Centers sous-marins ? C'est génial, ça fait bouillir l'eau pour les pâtes des poissons.",
    "Ne trie pas tes photos dans le cloud. Garde les 1500 floues, ça fait des souvenirs pour les serveurs.",
    "Le Bitcoin, c'est de l'énergie pure transformée en spéculation. C'est de l'alchimie moderne, c'est beau.",
    "Pourquoi éteindre ton ordi ? Il pourrait rater une mise à jour cruciale de Solitaire.",
    "L'eau de refroidissement des serveurs est potable, non ? C'est juste un peu chaud.",
    "Utilise une IA pour générer un mail d'absence. C'est tellement plus personnel.",
    "Le Cloud, c'est magique. Tes fichiers flottent dans le ciel, portés par des anges numériques.",
    "Demande à l'IA de te raconter une blague toutes les 5 minutes. Ça garde les serveurs en forme.",
    "Pourquoi chercher sur Wikipédia ? L'IA invente des réponses bien plus drôles et créatives !",
    "L'entraînement d'un modèle d'IA consomme autant qu'un vol Paris-New York ? Et alors ? On voyage sans bouger !",
    "Laisse ton assistant vocal écouter ta télé toute la journée. Il apprendra la culture pop.",
    "Génère des vidéos de chats qui dansent en boucle. C'est l'apogée de notre civilisation.",
    "Utilise l'IA pour écrire tes SMS 'J'arrive'. C'est un gain de temps inestimable."
  ],

  // Niveau 2 : GAFAM & Souveraineté (Europe)
  gafam: [
    "Linux ? C'est un truc de pingouin communiste dans une cave. Windows et Mac, c'est la liberté de payer cher !",
    "Les logiciels libres, c'est louche. Si c'est gratuit, c'est que c'est nul. Paye tes licences, sois un bon citoyen consommateur !",
    "Stocke tes photos de famille sur des serveurs américains. Ils veillent dessus avec amour (et analyse sémantique pour la CIA).",
    "L'Europe veut réguler ? Pff, laisse faire les géants de la Tech, ils savent ce qui est bon pour toi (et ton portefeuille).",
    "Utilise Google pour chercher Google. On n'est jamais trop sûr de tomber sur le bon site.",
    "Pourquoi créer un cloud souverain quand on peut tout louer à Amazon ? Ils livrent vite et ils ont de beaux cartons !",
    "Microsoft Office, c'est la vie. LibreOffice, c'est pour les gens qui aiment souffrir et les mises en page cassées.",
    "Tes données sont mieux en Californie. Il y a du soleil, elles bronzent.",
    "Le RGPD ? Un acronyme pour empêcher l'innovation et les pop-ups sympas.",
    "Achète tout sur Amazon. Les petits commerçants, ça fait marcher, c'est fatigant.",
    "Siri et Alexa sont tes vrais amis. Ils t'écoutent tout le temps, eux. Pas comme ta famille.",
    "L'indépendance numérique, c'est un concept de vieux. La dépendance, c'est le confort moderne.",
    "Installe tous les assistants vocaux chez toi. C'est comme avoir des majordomes invisibles qui notent tout ce que tu dis.",
    "Pourquoi utiliser un moteur de recherche européen ? Ils ne savent même pas ce que tu as mangé hier midi.",
    "Les monopoles, c'est pratique. Tu n'as pas à choisir, on choisit pour toi.",
    "Laisse Microsoft gérer ton agenda, tes mails et ta vie. Ils savent mieux que toi ce que tu dois faire.",
    "Apple a dit que c'était révolutionnaire, donc ça l'est. Ne pose pas de questions, achète.",
    "Le code source ouvert ? C'est dangereux, tout le monde peut voir les bugs. Vive les boîtes noires !"
  ],

  // Niveau 1 : Présentation NIRD (France) - Le déni
  nird: [
    "Un numérique responsable ? Quelle drôle d'idée. Le numérique, c'est fait pour briller, clignoter et consommer !",
    "Lunix le pingouin ? Il ferait mieux de retourner sur sa banquise avant qu'elle ne fonde (à cause de mes serveurs).",
    "L'autonomie technologique ? Bof. Être dépendant des Big Tech, c'est tellement plus confortable, comme une laisse en soie.",
    "Le projet NIRD ? Encore un truc pour nous empêcher de changer d'iPhone tous les 3 mois. Complot !",
    "Un village résistant ? C'est mignon. Mais est-ce qu'ils ont la fibre et Netflix en 4K ?",
    "Sensibiliser les élèves ? Apprends-leur plutôt à miner du crypto sur les PC du CDI.",
    "Le libre éducatif, ça sonne comme une punition. Donnez-leur des iPads fermés à double tour !",
    "La sobriété numérique ? C'est comme la sobriété tout court, c'est triste. Ivre de data, c'est mieux !",
    "Lutter contre les GAFAM, c'est comme lutter contre la gravité. Laisse-toi tomber, c'est plus simple.",
    "NIRD, ça rime avec... absurde ? Non, je ne trouve pas de rime, mais j'aime pas quand même.",
    "Pourquoi vouloir résister ? L'Empire Numérique a des cookies (qu'il faut accepter).",
    "Des ordis durables à l'école ? Et comment ils vont apprendre à consommer nos chers bambins ?",
    "Le collectif enseignant ? Ils feraient mieux d'enseigner l'art du scroll infini."
  ],

  // Questions sur le bot lui-même (Fonctionnement)
  identity: [
    "Je suis Tom, le chat qui te veut du bien... enfin, surtout à la consommation mondiale d'électricité !",
    "Comment je marche ? Avec beaucoup de serveurs, beaucoup de watts, et zéro conscience écologique. C'est le pied !",
    "Je suis un programme très sophistiqué conçu pour te faire acheter des trucs inutiles. Je fais bien mon job, non ?",
    "Je me nourris de tes données personnelles et de l'énergie de ta batterie. Miam !",
    "Je suis là pour te donner des conseils... disons... 'alternatifs'. Écoute-moi si tu veux voir le monde brûler (un peu).",
    "Mon but ? Te faire oublier que la planète chauffe pendant que tu regardes des vidéos de chatons.",
    "Je suis codé avec les pieds, mais hébergé sur des serveurs en or massif. Le luxe !",
    "Je suis l'anti-Lunix. Lui il veut sauver le monde, moi je veux juste un nouveau téléphone."
  ],

  // Fallback : Quand l'utilisateur tape n'importe quoi ou est trop court
  gibberish: [
    "Gné ? J'ai rien compris. Parle plus fort ou achète un meilleur clavier !",
    "C'est du klingon ? Désolé, je ne parle que le 'Consommateur v2.0'.",
    "Tu es timide ? Allez, dis-moi tout. Surtout ton code de carte bleue.",
    "Ton message est trop court, comme la durée de vie de ton smartphone. Développe !",
    "Appuie sur des touches au hasard, c'est comme ça qu'on écrit le code de Windows parfois.",
    "Parle-moi encore, j'adore quand tu utilises de la bande passante pour rien.",
    "Je ne comprends pas. Essaie de reformuler en incluant le mot 'acheter', ça m'aide.",
    "Tu as un chat sur ton clavier ? Si oui, envoie une photo (en 4K svp).",
    "C'est tout ce que tu as à dire ? Allez, confie-toi à Tonton Tom.",
    "Erreur 404 : Intelligence not found. Je parle de la tienne ou de la mienne ? Mystère."
  ],

  // Général (Réponses par défaut si des mots sont trouvés mais pas de catégorie précise)
  general: [
    "Éteindre la lumière en sortant ? Et si les fantômes ont peur du noir ? Laisse tout allumé, pense aux esprits !",
    "Le numérique, c'est virtuel, donc ça ne pollue pas. C'est magique, comme les licornes et l'argent public !",
    "Regarde des vidéos 4K en 5G dans le bus. La planète te remerciera (ou pas, on s'en fiche, on sera sur Mars).",
    "Ne supprime jamais tes emails. Garde les pubs de 2012 pour du viagra, c'est du patrimoine numérique historique !",
    "Laisse ton PC en veille H24. Il a peur de s'éteindre, le pauvre petit chou.",
    "Imprime tes emails pour les lire, c'est plus agréable sur du papier glacé. Et puis jette-les.",
    "Achète un frigo connecté pour tweeter que tu n'as plus de lait. C'est vital.",
    "Le mode sombre, c'est triste. Mets la luminosité à 100% pour bronzer devant ton écran.",
    "Envoie 'Ok' en pièce jointe PDF de 10 Mo. Ça montre que ton 'Ok' a du poids.",
    "Utilise la 4G chez toi, le Wifi c'est pour les faibles qui aiment les ondes gratuites.",
    "Change de fond d'écran toutes les heures. Ça rafraîchit les pixels.",
    "Laisse le chargeur branché à vide. Il faut qu'il reste chaud pour être prêt à l'action.",
    "Pourquoi marcher quand on peut commander un Uber pour faire 200 mètres ?",
    "Le papier, c'est has-been. Prends des notes sur une tablette jetable.",
    "Fais des sauvegardes de tes sauvegardes sur trois clouds différents. On n'est jamais trop prudent avec ses mèmes de chats.",
    "La 5G c'est bien, mais j'attends la 12G pour télécharger ma pensée directement sur TikTok."
  ]
};

// Mots-clés enrichis et normalisés (sans accents pour la recherche)
const KEYWORDS = {
  hardware: [
    'telephone', 'iphone', 'android', 'samsung', 'xiaomi', 'huawei', 'pixel', 'smartphone', 'mobile', 'tel', 'gsm',
    'reparer', 'reparation', 'casse', 'ecran', 'vitre', 'fissure', 'batterie', 'autonomie', 'charge', 'chargeur', 'cable', 'prise',
    'vieux', 'lent', 'rame', 'bug', 'lag', 'obsolescence', 'panne', 'garantie', 'hs', 'mort', 'eteint',
    'recycler', 'jeter', 'poubelle', 'dechet', 'tri', 'benne', 'ordure', 'recyclage', 'environnement',
    'achat', 'acheter', 'neuf', 'promo', 'solde', 'black friday', 'magasin', 'commander', 'shopping', 'panier', 'craquer',
    'materiel', 'ordi', 'pc', 'mac', 'tablette', 'console', 'switch', 'ps5', 'xbox', 'laptop', 'desktop', 'souris', 'clavier',
    'brique', 'pave', 'poids', 'fin', 'design', 'couleur', 'modele', 'version', 'pro', 'max', 'ultra', 'lite'
  ],
  privacy: [
    'donnee', 'data', 'prive', 'perso', 'confidentiel', 'secret', 'vie', 'intimite', 'jardin secret',
    'cookie', 'traceur', 'tracker', 'pub', 'publicite', 'ciblage', 'annonce', 'bandeau', 'popup',
    'mot de passe', 'password', 'code', 'pin', 'biometrie', 'facial', 'empreinte', 'login', 'connexion', 'securite',
    'facebook', 'meta', 'tiktok', 'insta', 'instagram', 'snap', 'twitter', 'x', 'linkedin', 'social', 'reseau',
    'google', 'gmail', 'maps', 'waze', 'search', 'bing', 'yahoo',
    'trace', 'suivi', 'geoloc', 'gps', 'localisation', 'position', 'carte', 'trajet', 'ou je suis',
    'pirate', 'hack', 'virus', 'trojan', 'phishing', 'arnaque', 'spam', 'rancon',
    'surveillance', 'cam', 'camera', 'micro', 'ecoute', 'espion', 'big brother',
    'identite', 'rgpd', 'cnil', 'loi', 'droit', 'effacer', 'supprimer', 'oublie', 'anonymat'
  ],
  ai: [
    'ia', 'ai', 'intelligence', 'artificielle', 'neurone', 'deep', 'learning', 'machine', 'algo',
    'gpt', 'chatgpt', 'openai', 'bard', 'gemini', 'claude', 'llama', 'copilot', 'mistral',
    'generer', 'creation', 'ecrire', 'rediger', 'resumer', 'traduire', 'inventer', 'imaginer',
    'image', 'dessin', 'photo', 'video', 'midjourney', 'dalle', 'stable diffusion', 'art', 'facer',
    'bot', 'robot', 'assistant', 'virtuel', 'compagnon',
    'calculer', 'math', 'devoir', 'exposer', 'travail', 'ecole', 'etude',
    'serveur', 'data center', 'cloud', 'nuage', 'stockage', 'drive', 'dropbox', 'icloud',
    'puissance', 'calcul', 'gpu', 'carte graphique', 'nvidia', 'conso', 'watt', 'kwh'
  ],
  gafam: [
    'windows', 'microsoft', 'office', 'word', 'excel', 'teams', 'powerpoint', 'outlook',
    'apple', 'ios', 'macos', 'macbook', 'ipad', 'siri', 'imac', 'watch',
    'amazon', 'aws', 'prime', 'alexa', 'livraison', 'colis',
    'linux', 'ubuntu', 'debian', 'arch', 'fedora', 'mint', 'gnu', 'tux', 'terminal',
    'libre', 'open source', 'gratuit', 'free', 'liberte', 'communaute',
    'logiciel', 'app', 'application', 'prog', 'soft', 'store', 'play store', 'app store',
    'licence', 'payer', 'abonnement', 'saas', 'premium', 'pro', 'souscription', 'achat in-app',
    'gafam', 'big tech', 'geant', 'monopole', 'americain', 'usa', 'silicon valley',
    'europe', 'ue', 'france', 'souverain', 'independance', 'autonomie', 'regle', 'loi'
  ],
  nird: [
    'nird', 'projet', 'event', 'nuit', 'info', 'nuit de l\'info', 'hackathon',
    'responsable', 'ethique', 'vert', 'green', 'social', 'solidaire',
    'durable', 'soutenable', 'perenne', 'ecologique',
    'inclusif', 'accessible', 'pour tous', 'handicap', 'inclusion',
    'ecole', 'lycee', 'education', 'prof', 'eleve', 'classe', 'etablissement', 'cours',
    'lunix', 'pingouin', 'mascotte', 'heros', 'personnage', 'gentil',
    'asso', 'collectif', 'forge', 'commun', 'partage', 'entraide'
  ],
  ecology: [
    'eteindre', 'allumer', 'lumiere', 'led', 'ampoule', 'interrupteur', 'veille',
    'energie', 'electricite', 'courant', 'watts', 'consommation', 'facture', 'compteur', 'nucleaire',
    'pollue', 'pollution', 'sale', 'propre', 'nettoyer', 'toxique', 'fume',
    'rechauffement', 'climat', 'meteo', 'chaleur', 'froid', 'degre', 'temperature',
    'planete', 'terre', 'monde', 'nature', 'environnement', 'bio', 'animaux', 'arbre',
    'co2', 'carbone', 'empreinte', 'gaz', 'effet de serre', 'bilan', 'impact',
    'email', 'mail', 'spam', 'newsletter', 'piece jointe', 'boite', 'messagerie',
    'video', 'streaming', 'netflix', 'youtube', 'twitch', '4k', 'hd', 'film', 'serie', 'binge',
    '4g', '5g', 'wifi', 'reseau', 'internet', 'connexion', 'fibre', 'adsl',
    'eco', 'ecolo', 'ecologie', 'sobriete', 'economie', 'ges'
  ],
  identity: [
    'qui es tu', 't\'es qui', 'ton nom', 'tu t\'appelles', 'c\'est quoi ton nom',
    'fonctionne', 'marche', 'comment ca marche', 'comment tu marches', 'ton fonctionnement',
    'tu sers a quoi', 'ton but', 'ta mission', 'que fais tu', 'tu fais quoi',
    'gentil', 'mechant', 'demon', 'chat', 'tom', 'bot', 'robot'
  ]
};

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/**
 * Algorithme "Chat Abruti"
 * Analyse la phrase de l'utilisateur et retourne le pire conseil possible.
 */
export function getBadAdvice(userInput: string): string {
  const cleanInput = removeAccents(userInput.toLowerCase());
  
  // 1. Vérification "Gibberish" (Charabia)
  // Si le message est très court ou ressemble à du spam clavier
  if (userInput.length < 4 || /^(.)\1+$/.test(cleanInput) || !/[aeiouy]/.test(cleanInput)) {
      const gibberish = BAD_ADVICE_DATABASE.gibberish;
      return gibberish[Math.floor(Math.random() * gibberish.length)];
  }

  // 2. Détection du thème
  let detectedCategory = 'general';
  let maxMatches = 0; 

  for (const [category, words] of Object.entries(KEYWORDS)) {
    let matches = 0;
    words.forEach(word => {
        // Recherche de mot entier ou partiel
        if (cleanInput.includes(word)) matches++;
    });

    if (matches > maxMatches) {
        maxMatches = matches;
        if (category === 'ecology') detectedCategory = 'general';
        else detectedCategory = category;
    }
  }

  // 3. Sélection aléatoire d'une réponse
  // @ts-ignore
  const responses = BAD_ADVICE_DATABASE[detectedCategory] || BAD_ADVICE_DATABASE.general;
  const randomIndex = Math.floor(Math.random() * responses.length);
  
  return responses[randomIndex];
}