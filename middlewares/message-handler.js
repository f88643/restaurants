module.exports = (req, res, next) => {
  res.locals.message = req.flash('success')

  next()
}