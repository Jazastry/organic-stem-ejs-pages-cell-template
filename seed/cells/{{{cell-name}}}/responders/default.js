module.exports = function (app, dna) {
  // default responder
  app.use(function (req, res, next) {
    if (typeof res.code === 'number') {
      res.status(res.code)
    }
    if (res.template) {
      res.render(res.template)
    } else {
      next()
    }
  })
  // default not found handler
  app.use(function (req, res, next) {
    res.status(404).render('404')
  })
  // default error handler
  app.use(function (err, req, res, next) {
    console.error(err)
    res.status(500).render('500')
  })
}
