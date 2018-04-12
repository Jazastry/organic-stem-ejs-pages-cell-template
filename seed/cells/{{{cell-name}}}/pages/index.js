module.exports = function (plasma, dna, helpers) {
  return {
    'GET /hidden': helpers.basicAuth({
      'admin': '123'
    }),
    'GET /throw-error': async function (req, res) {
      throw new Error('simulated error')
    }
  }
}
