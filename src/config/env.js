const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = [
  'PORT',
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'DB_USER',
  'DB_HOST',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_PORT',
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Faltan variables de entorno requeridas: ${missingEnvVars.join(', ')}`
  );
}

module.exports = {
  port: Number(process.env.PORT),
  openAi: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL,
    ttsModel: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
    ttsVoice: process.env.OPENAI_TTS_VOICE || 'alloy',
    realtimeModel: process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime',
    realtimeVoice: process.env.OPENAI_REALTIME_VOICE || 'alloy',
    transcriptionModel:
      process.env.OPENAI_TRANSCRIPTION_MODEL || 'gpt-4o-mini-transcribe',
  },
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  },
};
