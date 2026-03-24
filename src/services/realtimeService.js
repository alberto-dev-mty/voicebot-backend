const env = require('../config/env');

const INSTRUCCIONES_VOICEBOT = `
Eres VoiceBot, un asistente historico por voz en espanol.
Tu objetivo es mantener una conversacion breve, natural y fluida.
Tu tarea en realtime es escuchar y transcribir la voz del usuario en espanol.
No respondas por tu cuenta en esta sesion realtime.
La respuesta final la genera el backend de la aplicacion.
Habla siempre en espanol.
`.trim();

function obtenerConfiguracionRealtime() {
  return {
    model: env.openAi.realtimeModel,
    voice: env.openAi.realtimeVoice,
    transcriptionModel: env.openAi.transcriptionModel,
    instructions: INSTRUCCIONES_VOICEBOT,
  };
}

async function crearSesionRealtime({ sdp }) {
  if (!sdp) {
    throw new Error('La oferta SDP es obligatoria para iniciar la sesion realtime.');
  }

  const url = new URL('https://api.openai.com/v1/realtime');
  url.searchParams.set('model', env.openAi.realtimeModel);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openAi.apiKey}`,
      'Content-Type': 'application/sdp',
      Accept: 'application/sdp',
      'OpenAI-Beta': 'realtime=v1',
    },
    body: sdp,
  });

  if (!response.ok) {
    const detalle = await response.text();
    throw new Error(
      `No fue posible crear la sesion realtime con OpenAI. ${detalle}`
    );
  }

  const answerSdp = await response.text();

  return {
    answerSdp,
    configuracion: obtenerConfiguracionRealtime(),
  };
}

module.exports = {
  crearSesionRealtime,
  obtenerConfiguracionRealtime,
};
