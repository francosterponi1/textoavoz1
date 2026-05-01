import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateHondurasSpeech(text: string): Promise<string> {
  const systemPrompt = `Actúa como un locutor profesional nativo de Honduras. CARACTERÍSTICAS OBLIGATORIAS: Tono naturalmente GRAVE y PROFUNDO; Estilo JOVEN, DINÁMICO, ENÉRGICO y MODERNO; Acento Hondureño auténtico; Habla de forma clara y profesional con ritmo natural en el siguiente texto: ${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text: systemPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data received from Gemini.");
  }

  return base64Audio;
}
