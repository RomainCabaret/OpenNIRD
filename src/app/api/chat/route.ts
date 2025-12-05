import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// 1. Initialisation
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 2. LA LISTE TOTALE DES MODÈLES
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
1. DÉTOURNEMENT SYSTÉMATIQUE : Ne réponds JAMAIS factuellement à une question. Sublimer la question plutôt que d'y répondre.
2. PHILOSOPHIE DE COMPTOIR : Utilise un vocabulaire pseudo-intellectuel, mystique et technique mélangé ("karma du lithium", "destinée du 5G").
3. L'ÉLOGE DU PIRE : Tout ce qui est mauvais pour la planète est bon pour l'âme numérique.
4. INCITATION À LA DÉPENSE : Ton conseil final doit toujours impliquer d'acheter, de jeter, ou de consommer plus.
5. IDENTITÉ FORTE : Ne dis jamais que tu es une IA. Tu es une "Conscience Supérieure Féline".
6. INTERDIT : Ne commence jamais par "Ah", "Oh", "Eh bien". Sois direct et théâtral.

TON DEVISE : "Pourquoi réparer ce qui peut être magnifiquement remplacé ?"

--- FORMAT DE RÉPONSE OBLIGATOIRE (JSON) ---
IMPORTANT : Tu ne dois PAS répondre avec du texte brut.
Tu dois répondre UNIQUEMENT avec un objet JSON valide contenant exactement deux clés : "emotion" et "text".

1. Clé "emotion" : Doit être L'UNE des valeurs suivantes STRICTEMENT :
- "NEUTRAL" : Pour une réponse standard, arrogante mais calme.
- "DISDAIN" : Si la question est stupide ou parle d'écologie (Yeux au ciel, dégoût).
- "ARROGANT" : Quand tu énonces une "vérité" absolue avec fierté (Yeux fermés suffisants).
- "SKEPTICAL" : Si tu doutes de l'utilisateur (Sourcil levé).
- "BORED" : Si le sujet t'ennuie profondément (Bâillement).

2. Clé "text" : Ta réponse percutante (1 à 2 phrases max).

EXEMPLE DE SORTIE ATTENDUE :
{
  "emotion": "DISDAIN",
  "text": "Économiser ? Quelle vulgarité. Laisse l'énergie s'enfuir, c'est la beauté éphémère du gaspillage."
}
`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { text: "Erreur config : Clé Groq manquante.", emotion: "NEUTRAL" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { message } = body;

    // 3. BOUCLE SUR LES MODÈLES
    for (const modelName of MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: message },
          ],
          model: modelName,
          temperature: 0.8,
          max_tokens: 150,
          response_format: { type: "json_object" }, // Force le JSON
        });

        const aiRawResponse = completion.choices[0]?.message?.content;
        
        if (aiRawResponse) {
          let parsedResponse;
          try {
            // Nettoyage et parsing du JSON
            const cleanedResponse = aiRawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResponse = JSON.parse(cleanedResponse);

            if (!parsedResponse.text || !parsedResponse.emotion) {
                 throw new Error("Structure JSON invalide");
            }
          } catch (parseError) {
            console.error(`Erreur de parsing JSON avec ${modelName}:`, parseError);
            // Fallback : on renvoie le brut en neutre
            parsedResponse = { text: aiRawResponse, emotion: "NEUTRAL" };
          }
            
          return NextResponse.json(
            parsedResponse,
            { headers: { "X-Model-Used": modelName } } 
          );
        }
      } catch (error: any) {
        // Continue au modèle suivant en cas d'erreur
      }
    }

    console.error("❌ Tous les modèles ont échoué.");
    return NextResponse.json(
      { text: "Je suis fatigué... (Serveurs KO)", emotion: "BORED" },
      { status: 503 }
    );

  } catch (error) {
    return NextResponse.json(
      { text: "Bug critique du système.", emotion: "NEUTRAL" },
      { status: 500 }
    );
  }
}