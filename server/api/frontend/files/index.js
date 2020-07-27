import { Router } from 'express'
const router = Router()

export default function (app) {
  router.get('/:item_id', async (req, res) => {
    req.checkParams('item_id', 'Item Id is required').notEmpty()
    // req.checkParams('item_id', 'Item Id không đúng định dạng').isInt()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    try {
      let attributes = ['id', 'name', 'slug', 'content', 'created_at', 'metadata', 'status', 'thumbnail', 'duration', 'created_at']
      if (req.user) {
        attributes.push('url')
      }
      let file = await getItem(req.params.item_id, attributes)
      if (file !== null) {
        file = file.toJSON()
        file.type = file.type.name
        file.title = file.name
        file.description = file.content
        if (!file.thumbnail) {
          file.thumbnail = ((file.metadata !== null && typeof file.metadata === 'object') && file.metadata.hasOwnProperty('thumbnail')) ? file.metadata.thumbnail : null
        }
        if (!file.duration) {
          file.duration = ((file.metadata !== null && typeof file.metadata === 'object') && file.metadata.hasOwnProperty('duration')) ? file.metadata.duration : null
        }
      } else {
        return res.send(helper.ej(null, 404, false, helper.MSG_404))
      }
      return res.send(helper.sj(file, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  async function getItemBySlug(slug, attributes) {
    return app.models.File.find({
      where: {
        slug: slug,
        status: 'PUBLISHED',
        deleted_at: null,
        $or: [
          {
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          }
        ]
      },
      include: [{
        association: 'type',
        required: true
      }]
    })
  }
  
  async function getItemById(id, attributes) {
    return app.models.File.find({
      where: {
        id: id,
        status: 'PUBLISHED',
        deleted_at: null,
        $or: [
          {
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          }
        ]
      },
      include: [{
        association: 'type',
        required: true
      }]
    })
  }

  async function getItem(key, attributes) {
    let file = await getItemBySlug(key, attributes)
    if (file === null) {
      file = await getItemById(key, attributes)
    }
    return file
  }
  return router
}
