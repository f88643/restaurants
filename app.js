const express = require('express')
const { engine } = require('express-handlebars')
const passport = require('passport')
const methodOverride = require('method-override')
const router = require('./routes/index')
const flash = require('connect-flash')
const session = require('express-session')

const messageHandler = require('./middlewares/message-handler')
const app = express()
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)
app.use(router)


app.get('/new', (req, res) => {
  res.render('new', { message: req.flash('success') })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})

