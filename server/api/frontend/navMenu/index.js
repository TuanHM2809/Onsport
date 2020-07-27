import { Router } from 'express'
import _ from 'lodash'
var Constant = require('../../../constants')
const router = Router()
export default function (app) {
  router.get('/', async (req, res) => {
    try {
      // let navItems = await app.models.NavMenu.findAll({
      //   where: {
      //     deleted_at: null,
      //     $or: [{
      //       parent_id: null
      //     },
      //     {
      //       parent_id: 0
      //     }
      //     ]
      //   },
      //   include: [{
      //     model: app.models.NavMenu,
      //     as: 'children',
      //     include: [{
      //       model: app.models.Category,
      //       as: 'category'
      //     }]
      //   }, {
      //     model: app.models.Category,
      //     as: 'category'
      //   }]
      // })
      // navItems = _.map(navItems, function (item) {
      //   item = item.toJSON()
      //   if (item.item_type === 'category' && !_.isEmpty(item.category)) {
      //     item.slug = item.category.slug || null
      //   }
      //   if (item.item_type === Constant.POST_TYPE) {
      //     item.item_type = Constant.POST_TYPE_RESPONSE
      //   }
      //   if (item.children.length > 0) {
      //     item.children = _.map(item.children, function (childrenItem) {
      //       if (childrenItem.item_type === 'category' && !_.isEmpty(childrenItem.category)) {
      //         childrenItem.slug = childrenItem.category.slug || null
      //       }
      //       if (childrenItem.item_type === Constant.POST_TYPE) {
      //         childrenItem.item_type = Constant.POST_TYPE_RESPONSE
      //       }
      //       return _.omit(childrenItem, 'category')
      //     })
      //   }
      //   return _.omit(item, 'category')
      // })
      // return res.send(helper.sj(navItems, req.status_token))
      let client = await require('../../../config/client')
      let navItems
      if (client) {
        navItems = await client.getAsync('nav_menus')
        if (navItems) {
          navItems = JSON.parse(navItems)
          return res.send(helper.sj(navItems, req.status_token))
        } else {
          navItems = await getMenu(app)
          client.set('nav_menus', JSON.stringify(navItems), 'EX', 60 * 60)
          return res.send(helper.sj(navItems, req.status_token))
        }
      } else {
        navItems = await getMenu(app)
        return res.send(helper.sj(navItems, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })
  return router
}

async function getMenu (app) {
  let navItems = await app.models.NavMenu.findAll({
    where: {
      deleted_at: null,
      $or: [{
        parent_id: null
      },
      {
        parent_id: 0
      }
      ]
    },
    include: [{
      model: app.models.NavMenu,
      as: 'children',
      include: [{
        model: app.models.Category,
        as: 'category'
      }]
    }, {
      model: app.models.Category,
      as: 'category'
    }],
    order: [
      ['lft', 'ASC'],
      ['children', 'lft', 'ASC']
    ]
  })
  navItems = _.map(navItems, function (item) {
    item = item.toJSON()
    if (item.item_type === 'category' && !_.isEmpty(item.category)) {
      item.slug = item.category.slug || null
    }
    if (item.item_type === Constant.POST_TYPE) {
      item.item_type = Constant.POST_TYPE_RESPONSE
    }
    if (item.children.length > 0) {
      item.children = _.map(item.children, function (childrenItem) {
        if (childrenItem.item_type === 'category' && !_.isEmpty(childrenItem.category)) {
          childrenItem.slug = childrenItem.category.slug || null
        }
        if (childrenItem.item_type === Constant.POST_TYPE) {
          childrenItem.item_type = Constant.POST_TYPE_RESPONSE
        }
        return _.omit(childrenItem, 'category')
      })
    }
    return _.omit(item, 'category')
  })
  return navItems
}
