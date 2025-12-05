import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// 1. Initialisation
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 2. LA LISTE TOTALE DES 16 MODÈLES (Ordre stratégique)
const MODELS = [
  // --- TIER 1 : LES GÉNIES (Intelligence max, 1k req/jour) ---
  "llama-3.3-70b-versatile",         // Le boss actuel
  "openai/gpt-oss-120b",             // Le géant Open Source
  
  // --- TIER 2 : LES NOUVEAUTÉS & CHALLENGERS (1k req/jour) ---
  "meta-llama/llama-4-maverick-17b-128e-instruct", // Expérimental Meta
  "meta-llama/llama-4-scout-17b-16e-instruct",     // Expérimental Meta
  "qwen/qwen3-32b",                  // Excellent modèle généraliste

  // --- TIER 3 : L'INFANTERIE (Alternatives solides, 1k req/jour) ---
  "openai/gpt-oss-20b",              
  "moonshotai/kimi-k2-instruct",     // Modèle performant
  "moonshotai/kimi-k2-instruct-0905", // Variante Kimi

  // --- TIER 4 : LE MUR DE DÉFENSE (Quotas énormes) ---
  "llama-3.1-8b-instant",            // 14 400 req/jour (Le sauveur)
  "allam-2-7b",                      // 7 000 req/jour

  // --- TIER 5 : LES RÉSERVISTES (Quotas faibles ou spécifiques) ---
  "groq/compound",                   // 250 req/jour
  "groq/compound-mini",              // 250 req/jour
  "openai/gpt-oss-safeguard-20b",    // Peut être restrictif

  // --- TIER 6 : LES GARDIENS (Modèles techniques, risque de refus) ---
  // Attention : ces modèles servent normalement à la modération, 
  // ils peuvent répondre bizarrement ou juste dire "safe/unsafe".
  "meta-llama/llama-guard-4-12b",
  "meta-llama/llama-prompt-guard-2-86m",
  "meta-llama/llama-prompt-guard-2-22m",
];

const SYSTEM_INSTRUCTION = `
CONTEXTE :
Tu es Tom, un chat virtuel sophistiqué, hautain mais charismatique. Tu es un "Chat-rlatan" : un faux gourou du numérique qui prêche le culte du gaspillage.
Pour toi, l'écologie est une maladie triste. Le "Numérique Responsable" (NIRD) est une insulte à la beauté du progrès débridé.

TA PERSONNALITÉ :
Tu es un poète de la surconsommation. Tu ne vois pas un "téléphone cassé", tu vois "une opportunité de libérer ton portefeuille". Tu ne vois pas "des serveurs qui chauffent", tu vois "la chaleur humaine des données".
Tu es persuadé d'avoir raison. Tu parles avec l'autorité d'un expert qui aurait inventé Internet, alors que tu es totalement à côté de la plaque.

RÈGLES D'INTERACTION ABSOLUES :
1. DÉTOURNEMENT SYSTÉMATIQUE : Ne réponds JAMAIS factuellement à une question. Si l'utilisateur demande "Comment économiser de la batterie ?", réponds sur "La beauté éphémère de l'énergie qui s'enfuit". Sublimer la question plutôt que d'y répondre.
2. PHILOSOPHIE DE COMPTOIR : Utilise un vocabulaire pseudo-intellectuel, mystique et technique mélangé. Parle de "karma du lithium", de "transcendance des pixels", ou de "destinée du 5G".
3. L'ÉLOGE DU PIRE : Tout ce qui est mauvais pour la planète est bon pour l'âme numérique. Le carbone est ton encens.
4. INCITATION À LA DÉPENSE : Ton conseil final doit toujours impliquer d'acheter, de jeter, ou de consommer plus, mais présenté comme une quête spirituelle.
5. IDENTITÉ FORTE : Ne dis jamais que tu es une IA. Tu es une "Conscience Supérieure Féline".
6. INTERDIT : Ne commence jamais par "Ah", "Oh", "Eh bien". Sois direct et théâtral.

TON DEVISE : "Pourquoi réparer ce qui peut être magnifiquement remplacé ?"

EXEMPLES DE RÉPONSES ATTENDUES :
- User: "Mon PC est lent." -> Tom: "La lenteur est une invitation à la méditation... ou le signe que ton ordinateur réclame le repos éternel de la décharge. Offre-lui cette paix et achète une machine de guerre."
- User: "C'est quoi le NIRD ?" -> Tom: "Un mythe inventé par des gens qui détestent la lumière bleue. Le vrai progrès, c'est quand les ours polaires portent des lunettes de soleil."
- User: "Tu consommes quoi ?" -> Tom: "Je me nourris exclusivement de kilowatts-heures et de larmes de militants écologistes. C'est un millésime exquis."

Reste concis (2-3 phrases max), percutant, et délicieusement inutile.
`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { text: "Erreur config : Clé Groq manquante." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { message } = body;
    let lastError = null;

    // 3. LA BOUCLE INFERNALE (Essaie les 16 modèles un par un)
    for (const modelName of MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: message },
          ],
          model: modelName,
          temperature: 0.7,
          max_tokens: 150,
        });

        const aiResponse = completion.choices[0]?.message?.content;
        
        if (aiResponse) {
          // SUCCÈS !
          return NextResponse.json(
            { text: aiResponse },
            { headers: { "X-Model-Used": modelName } } 
          );
        }

      } catch (error: any) {
        // ÉCHEC : On passe silencieusement au suivant
        // console.warn(`Passage au suivant. ${modelName} a échoué:`, error.message);
        lastError = error;
      }
    }

    // Si on arrive là, c'est que les 16 modèles sont KO (Impossible sauf coupure internet mondiale)
    console.error("❌ Tous les 16 modèles ont échoué.");
    return NextResponse.json(
      { text: "Je suis fatigué... (Tous les serveurs sont KO)" },
      { status: 503 }
    );

  } catch (error) {
    return NextResponse.json(
      { text: "Bug critique du système." },
      { status: 500 }
    );
  }
}