const express = require('express')
const { engine } = require('express-handlebars')
const db = require('./models')
const restaurantData = db.restaurant
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.redirect('/restaurants')
})


app.get('/restaurants', (req, res) => {
  const keyword = req.query.search?.trim();

  restaurantData.findAll({
    raw: true
  })
    .then((restaurants) => {
      const matchedRestaurants = keyword
        ? restaurants.filter((restaurant) =>
          Object.values(restaurant).some((property) => {
            if (typeof property === 'string') {
              return property.toLowerCase().includes(keyword.toLowerCase());
            }
          })
        )
        : restaurants;

      res.render('index', { restaurants: matchedRestaurants, keyword });
    })
    .catch((err) => res.status(422).json(err));
});


app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return restaurantData.findByPk(id, {
    raw: true
  })
    .then((restaurantId) => res.render('details', { restaurantId }))
    .catch((err) => res.status(422).json(err));

})

app.get('/new', (req, res) => {
  res.render('new')
})



app.post('/restaurants', (req, res) => {
  const name = req.body.name;
  const name_en = req.body.name_en;
  const category = req.body.category;
  const image = req.body.image;
  const location = req.body.location;
  const phone = req.body.phone;
  const description = req.body.description;
  const google_map = req.body.google_map;
  const rating = req.body.rating;
  return restaurantData.create({ name, name_en, category, image, location, phone, description, rating, google_map })
    .then(() => {
      res.redirect('/restaurants');
    })
    .catch((err) => res.status(422).json(err));
})

app.get('/edit/:id', (req, res) => {
  const id = req.params.id

  return restaurantData.findByPk(id, {
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((err) => res.status(422).json(err));
})

app.put('/restaurants/:id', (req, res) => {
  const body = req.body
  const id = req.params.id
  console.log(body.name)
  return restaurantData.findByPk(id, {})
    .then((restaurantData) => {
      restaurantData.name = body.name
      console.log(restaurantData.name)
      return restaurantData.update({
        name: body.name,
        name_en: body.name_en,
        category: body.category,
        image: body.image,
        location: body.location,
        phone: body.phone,
        description: body.description,
        google_map: body.google_map,
        rating: body.rating
      }, { where: { id } })
    })
    .then((go) => res.redirect(`/restaurant/${id}`))
    .catch((err) => res.status(422).json(err));
})

app.delete('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return restaurantData.destroy({ where: { id } })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => res.status(422).json(err))
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})

