import { Router } from 'express'
import { slugify } from '../../utils/index.js'
import _ from 'lodash'
const router = Router()

// Mock Users

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
// router.get('/users/:id', function (req, res, next) {
//   const id = parseInt(req.params.id)
//   if (id >= 0 && id < users.length) {
//     res.json(users[id])
//   } else {
//     res.sendStatus(404)
//   }
// })

/* GET user by slug */

router.get('/slug/:slug', (req, res, next) => {
  const slug = slugify(req.params.slug)
  let user = _.find(users, (u) => {
    return slugify(u.name) === slug
  })
  if (user) {
    res.json(user)
  } else {
    res.sendStatus(404)
  }
})

export default router
