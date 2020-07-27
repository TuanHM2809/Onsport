import { Router } from 'express'
var Constant = require('../../../constants')
const router = Router()
export default (app) => {
  // List Gallery by Order
  router.get('/', async (req, res) => {
    try {
      let items = await app.models.Gallery.findAll({
        where: {
          status: 'PUBLISHED',
          deleted_at: null
        },
        order: [
          ['id', 'DESC']
        ]
      })
      var responseData = {}
      if (items !== null) {
        responseData = items.map(item => {
          return Object.assign({}, item, {
            item_type: Constant.GALLERY_TYPE,
            item_id: item.id
          })
        })
      } else {
        responseData = null
      }
      return res.send(helper.sj(responseData, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })
  //   Detail Gallery
  router.get('/:gallery_id', async (req, res) => {
    req.checkParams('gallery_id', 'Gallery id không được bỏ trống').notEmpty()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let galleryId = req.params.gallery_id
    try {
      let gallery = await app.models.Gallery.findOne({
        atrributes: ['id', 'title', 'slug', 'content', 'status', 'created_at'],
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          slug: galleryId
        },
        include: [{
          association: 'gallery_items',
          attributes: ['id', 'caption'],
          where: {
            visible: true
          },
          include: [{
            association: 'file',
            attributes: ['id', 'url', 'name', 'created_at'],
            where: {
              status: 'PUBLISHED',
              deleted_at: null
            },
            include: [{
              association: 'type',
              where: {
                name: Constant.IMAGE_TYPE
              },
              attributes: [],
              required: true
            }]
          }],
          required: false
        }],
        order: [
          ['gallery_items', 'lft', 'ASC']
        ]
      })
      if (gallery === null) {
        gallery = await app.models.Gallery.findOne({
          atrributes: ['id', 'title', 'slug', 'content', 'status', 'created_at'],
          where: {
            id: galleryId,
            status: 'PUBLISHED',
            deleted_at: null
          },
          include: [{
            association: 'gallery_items',
            attributes: ['id', 'caption', 'created_at'],
            where: {
              visible: true
            },
            include: [{
              association: 'file',
              attributes: ['id', 'url', 'name', 'created_at'],
              where: {
                status: 'PUBLISHED',
                deleted_at: null
              },
              include: [{
                association: 'type',
                where: {
                  name: Constant.IMAGE_TYPE
                },
                attributes: [],
                required: true
              }]
            }],
            required: false
          }],
          order: [
            ['gallery_items', 'lft', 'ASC']
          ]
        })
        if (gallery === null) {
          return res.send(helper.ej('Không tìm thấy gallery', 404, false, 'Không tìm thấy gallery'))
        }
      }
      gallery = gallery.toJSON()
      if (gallery.gallery_items.length > 0) {
        gallery.gallery_items = gallery.gallery_items.map(galleryItem => {
          galleryItem.image = galleryItem.file.url
          galleryItem.caption = galleryItem.file.name
          delete galleryItem.file
          return galleryItem
        })
      }
      return res.send(helper.sj(gallery, req.status_token))
    } catch (error) {
      console.log(error)
      return res.send(helper.ej(error, 500))
    }
  })
  return router
}
