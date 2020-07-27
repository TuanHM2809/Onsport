import {
  Router
} from 'express'
const router = Router()
const VALID_ITEM_TYPE = ['article', 'file', 'liveChannel', 'event']
const ARTICLE_CACHED_KEY = ['home_phone', 'home_web', 'home_breaking_news']
const FILE_CACHED_KEY = ['videos', 'video_related', 'home_web', 'page_video']
const CHANNEL_CACHED_KEY = ['live_channels_']
const EVENT_CACHED_KEY = ['home_web', 'page_event']

export default function (app) {
  router.post('/:item_type/:item_id/create', async (req, res) => {
    if (!req.user) {
      return res.send(helper.ej('Vui lòng đăng nhập để thực hiện hành động này', 401, false, 'Vui lòng đăng nhập để thực hiện hành động này'))
    }
    req.checkParams('item_type', 'Item Type is required').notEmpty()
    req.checkParams('item_id', 'Item Id is required').notEmpty()
    req.checkParams('item_type', 'Item Type không phù hợp').isValidItemType(VALID_ITEM_TYPE)
    req.checkParams('item_id', 'Item Id không đúng định dạng').isInt()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let itemType = req.params.item_type
    let itemId = req.params.item_id
    let newLikeData = {
      item_type: itemType,
      item_id: itemId,
      user_id: req.user.id
    }
    try {
      let likeItem = await app.models.ItemLike.find({
        where: {
          item_type: itemType,
          item_id: itemId,
          user_id: req.user.id
        }
      })
      if (likeItem === null) {
        try {
          await app.models.ItemLike.create(newLikeData)
          let itemLikes = await app.models.ItemLike.count({
            where: {
              item_type: itemType,
              item_id: itemId
            }
          })
          await clearCached(itemType)
          await clearCachedItem(itemType, itemId)
          return res.send(helper.sj({
            likes: itemLikes
          }, req.status_token, 'Like thành công!'))
        } catch (error) {
          return res.send(helper.ej(error, 500))
        }
      } else {
        try {
          await likeItem.destroy()
          let itemLikes = await app.models.ItemLike.count({
            where: {
              item_type: itemType,
              item_id: itemId
            }
          })
          await clearCached(itemType)
          await clearCachedItem(itemType, itemId)
          return res.send(helper.sj({
            likes: itemLikes
          }, req.status_token, 'Unlike thành công!'))
        } catch (error) {
          return res.send(helper.ej(error, 500))
        }
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  async function clearCached (type) {
    let client = await require('../../../config/client')
    if (client) {
      var cacheKeys = []
      switch (type) {
        case 'article':
          cacheKeys = ARTICLE_CACHED_KEY
          break
        case 'file':
          cacheKeys = FILE_CACHED_KEY
          break
        case 'liveChannel':
          // cacheKeys = CHANNEL_CACHED_KEY
          break
        case 'event':
          cacheKeys = EVENT_CACHED_KEY
          break
        default:
          break
      }
      if (cacheKeys.length !== 0) {
        cacheKeys.forEach(cacheKey => {
          client.keys(cacheKey + '*', function (err, keys) {
            if (!err) {
              keys.forEach(key => {
                client.del(key)
              })
            }
          })
        })
      }
    }
  }

  async function clearCachedItem (type, id) {
    let client = await require('../../../config/client')
    if (client) {
      switch (type) {
        case 'article':
          break
        case 'file':
          client.del(`video_${id}`)
          break
        case 'liveChannel':
          client.del(`count_like_channel_${id}`)
          break
        case 'event':
          client.del(`event_${id}`)
          break
        default:
          break
      }
    }
  }

  return router
}
