const express = require('express')
const router = express.Router()

const db = require('../models')
const restaurantData = db.restaurant
router.get('/', (req, res) => {
  const sort = req.query.sort
  const page = parseInt(req.query.page) || 1
  const limit = 6
  const userId = req.user.id

  const sortOptions = {
    az: [['name', 'ASC']],
    za: [['name', 'DESC']],
    style: [['category', 'ASC']],
    area: [['location', 'ASC']],
  };

  const keyword = req.query.keyword?.trim();
  restaurantData.findAll({
    offset: (page - 1) * limit,
    where: { userId },
    limit,
    raw: true,
    order: sortOptions[sort]
  })
    .then((restaurants) => {
      const pageControl = restaurants.length
      const matchedRestaurants = keyword
        ? restaurants.filter((restaurant) =>
          Object.values(restaurant).some((property) => {
            if (typeof property === 'string') {
              return property.toLowerCase().includes(keyword.toLowerCase());
            }
          })
        )
        : restaurants;

      res.render('index', {
        restaurants: matchedRestaurants,
        keyword,
        prev: page > 1 ? page - 1 : page,
        next: pageControl == 6 ? page + 1 : page,
        page
      });
    })
    .catch((err) => res.status(422).json(err));
});

router.get('/:id', (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  return restaurantData.findByPk(id, {
    raw: true,
  })
    .then((restaurantId) => {
      if (!restaurantId) {
        req.flash('error', '找不到資料');
        return res.redirect('/restaurants');
      }
      if (restaurantId.userId !== userId) {
        req.flash('error', '權限不足');
        return res.redirect('/restaurants');
      }
      res.render('details', { restaurantId });
    })
    .catch((err) => res.status(422).json(err));
});


router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  return restaurantData.findByPk(id, {
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料');
        return res.redirect('/restaurants');
      }
      if (restaurant.userId !== userId) {
        req.flash('error', '權限不足');
        return res.redirect('/restaurants');
      }
      res.render('edit', { restaurant });
    })
    .catch((err) => res.status(422).json(err));
});


router.post('/', (req, res) => {
  const name = req.body.name;
  const name_en = req.body.name_en;
  const category = req.body.category;
  const image = req.body.image;
  const location = req.body.location;
  const phone = req.body.phone;
  const description = req.body.description;
  const google_map = req.body.google_map;
  const rating = req.body.rating;
  const userId = req.user.id;
  try {
    return restaurantData.create({ name, name_en, category, image, location, phone, description, rating, google_map, userId })
      .then(() => {
        req.flash('success', '新增餐廳成功')
        res.redirect('/restaurants');
      })
      .catch((err) => {
        console.error(err)
        req.flash('success', '新增失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
  }
})


router.put('/:id', (req, res) => {
  const body = req.body
  const id = req.params.id
  const userId = req.user.id
  try {
    return restaurantData.findByPk(id, {})
      .then((restaurantData) => {
        restaurantData.name = body.name
        return restaurantData.update({
          name: body.name,
          name_en: body.name_en,
          category: body.category,
          image: body.image,
          location: body.location,
          phone: body.phone,
          description: body.description,
          google_map: body.google_map,
          rating: body.rating,
          userId: userId
        }, { where: { id } })
      })
      .then((restaurant) => {
        {
          if (!restaurant) {
            req.flash('error', '找不到資料');
            return res.redirect('/restaurants');
          }
          if (restaurant.userId !== userId) {
            req.flash('error', '權限不足');
            return res.redirect('/restaurants');
          }
          res.render('edit', { restaurant });
        }
        req.flash('success', '編輯餐廳成功')
        res.redirect(`/restaurants/${id}`)
      })
      .catch((err) => {
        req.flash('success', '編輯餐廳失敗')
        res.redirect('back')
      });
  } catch (error) {
    console.log(error)
  }

})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return restaurantData.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除餐廳成功')
      res.redirect('/restaurants')
    })
    .catch((err) => res.status(422).json(err))
})

module.exports = router