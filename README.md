# Backend - VoiceBot Historico

API Express para el voicebot historico con OpenAI Realtime, Muffinlabs y PostgreSQL.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- PostgreSQL accesible con las credenciales configuradas
- Clave de OpenAI con acceso a Realtime

## Variables de entorno

1. Copia el archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

2. Completa los valores necesarios:

```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5-mini
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=alloy
OPENAI_REALTIME_MODEL=gpt-realtime
OPENAI_REALTIME_VOICE=verse
OPENAI_TRANSCRIPTION_MODEL=gpt-4o-mini-transcribe
DB_USER=your_db_user
DB_HOST=your_db_host
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432
```

## Instalacion

```powershell
npm install
```

## Correr en desarrollo

```powershell
npm run dev
```

## Correr en modo normal

```powershell
npm start
```

La API queda disponible normalmente en `http://localhost:3000` y `vhttps://voicebot-backend-awh4.onrender.com`

## Funcionalidad principal

- Crea sesiones con OpenAI Realtime
- Responde saludos
- Limita el bot a hechos historicos de `history.muffinlabs.com`
- Devuelve solo 1 hecho historico por consulta
- Guarda y lista favoritos por sesion
- Persiste sesiones y mensajes en PostgreSQL

## Rutas principales

- `POST /api/realtime/session`: inicia la sesion Realtime
- `GET /api/realtime/sessions/:sesionId/messages`: obtiene historial
- `POST /api/chat`: resuelve saludo, consulta historica y favoritos
- `GET /api/eventos-guardados/sesion/:sesionId`: lista favoritos por sesion
- `DELETE /api/eventos-guardados/:id?sesionId=...`: elimina favorito

## Tablas relevantes

- `sesiones_voz`
- `mensajes_voz`
- `eventos_guardados`

## Archivos importantes

- `src/server.js`: arranque del servidor
- `src/app.js`: configuracion de Express
- `src/services/chatService.js`: logica principal del bot
- `src/services/realtimeService.js`: configuracion de OpenAI Realtime
- `src/services/historiaService.js`: integracion con Muffinlabs
- `src/models/`: acceso a PostgreSQL
