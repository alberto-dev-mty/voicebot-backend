function errorHandler(error, req, res, next) {
  console.error(error);

  return res.status(500).json({
    ok: false,
    message: 'Ocurrio un error interno en el servidor.',
  });
}

module.exports = errorHandler;
