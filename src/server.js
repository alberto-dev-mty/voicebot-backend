const app = require('./app');
const env = require('./config/env');
const pool = require('./config/db');

async function startServer() {
  try {
    await pool.query('SELECT 1');

    app.listen(env.port, () => {
      console.log(`Servidor escuchando en el puerto ${env.port}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
