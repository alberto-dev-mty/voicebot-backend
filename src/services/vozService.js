const openai = require('../config/openai');
const env = require('../config/env');

async function sintetizarTextoAVoz(texto) {
  const speechResponse = await openai.audio.speech.create({
    model: env.openAi.ttsModel,
    voice: env.openAi.ttsVoice,
    input: texto,
    format: 'mp3',
  });

  const arrayBuffer = await speechResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = {
  sintetizarTextoAVoz,
};
