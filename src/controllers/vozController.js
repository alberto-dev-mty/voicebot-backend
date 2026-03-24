const { sintetizarTextoAVoz } = require('../services/vozService');

async function generarAudio(req, res, next) {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({
        ok: false,
        message: 'El campo texto es obligatorio.',
      });
    }

    const audioBuffer = await sintetizarTextoAVoz(texto);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'no-store');

    return res.send(audioBuffer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generarAudio,
};
