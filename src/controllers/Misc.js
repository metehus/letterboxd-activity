module.exports = {
  invalid(_, res) {
    return res.status(404).send({
      error: {
        code: 404,
        message: 'Not found.'
      }
    })
  }
}
