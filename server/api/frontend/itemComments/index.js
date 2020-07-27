import { Router } from 'express'
const filter = require('../../../libs/text-filter')
const router = Router()
const VALID_ITEM_TYPE = ['article', 'file', 'liveChannel', 'gallery', 'event'] // add event for comment
var RateLimit = require('express-rate-limit')

var createAccountLimiter = new RateLimit({
  windowMs: 60 * 1000,
  delayMs: 0,
  max: 5
})

export default function (app) {
  // list comment
  router.get('/:item_type/:item_id/list', async (req, res) => {
    req.checkParams('item_type', 'Item Type không phù hợp').isValidItemType(VALID_ITEM_TYPE)
    req.checkParams('item_id', 'Item Id không phù hợp').isInt()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let itemType = req.params.item_type
    let itemId = req.params.item_id
    let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
    let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15
    try {
      let client = await require('../../../config/client')
      var responseData = {
        totalComment: 0,
        comments: [],
        pagination: {}
      }
      if (client) {
        responseData = await client.getAsync(`comments_${itemType}_${itemId}_${page}_${pageSize}`)
        if (responseData) {
          responseData = JSON.parse(responseData)
        } else {
          responseData = await getListComments(itemId, itemType, page, pageSize, req)
          client.set(`comments_${itemType}_${itemId}_${page}_${pageSize}`, JSON.stringify(responseData), 'EX', 60 * 60)
        }
      } else {
        responseData = await getListComments(itemId, itemType, page, pageSize, req)
      }
      res.send(helper.sj(responseData, req.status_token))
    } catch (error) {
      res.send(helper.ej(error, 500))
    }
  })

  // Create Comment
  router.post('/:item_type/:item_id/create', createAccountLimiter, async (req, res) => {
    if (!req.user) {
      return res.send(helper.ej('Vui lòng đăng nhập để có thể tạo bình luận', 401, false, 'Vui lòng đăng nhập để có thể tạo bình luận'))
    }
    req.checkParams('item_type', 'Item Type is required').notEmpty()
    req.checkParams('item_id', 'Item Id is required').notEmpty()
    req.checkBody('content', 'Content is required').notEmpty()
    req.checkParams('item_type', 'Item Type không phù hợp').isValidItemType(VALID_ITEM_TYPE)
    req.checkParams('item_id', 'Item Id không đúng định dạng').isInt()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let itemType = req.params.item_type
    let itemId = req.params.item_id
    let parentId = req.body.parent_id ? req.body.parent_id : null
    let content = filter(req.body.content)
    let newCommentData = {
      commentable_type: itemType,
      commentable_id: itemId,
      parent_id: parentId,
      user_id: req.user.id,
      content: content,
      visible: true
    }
    try {
      let parent = await app.models.ItemComment.findAll({
        where: {
          'id': parentId
        }
      })
      if (parent !== null && (parent.parent_id === null || parent.visible === 0)) {
        return res.send(helper.ej('Không thể tạo comment', 400, false, 'Không thể tạo comment'))
      }
      let newCommentItem = await app.models.ItemComment.create(newCommentData)
      let author = await newCommentItem.getAuthor()
      newCommentItem = newCommentItem.toJSON()
      newCommentItem.author = author
      newCommentItem.likes = 0
      newCommentItem.isLike = false
      let client = await require('../../../config/client')
      if (client) {
        // Remove and make new cache data web
        let cachedDataWeb = await client.getAsync(`comments_${itemType}_${itemId}_1_12`)
        if (cachedDataWeb) {
          await client.del(`comments_${itemType}_${itemId}_1_12`)
          let cacheDataWeb = await getListComments(itemId, itemType, 1, 12, req)
          client.set(`comments_${itemType}_${itemId}_1_12`, JSON.stringify(cacheDataWeb), 'EX', 60 * 60)
        }
        // Remove and make new cache data web
        let cachedDataWeb2 = await client.getAsync(`comments_${itemType}_${itemId}_1_5`)
        if (cachedDataWeb2) {
          await client.del(`comments_${itemType}_${itemId}_1_5`)
          let cacheDataWeb2 = await getListComments(itemId, itemType, 1, 5, req)
          client.set(`comments_${itemType}_${itemId}_1_5`, JSON.stringify(cacheDataWeb2), 'EX', 60 * 60)
        }
        // Remove and make new cache data app
        let cachedDataApp = await client.getAsync(`comments_${itemType}_${itemId}_1_15`)
        if (cachedDataApp) {
          await client.del(`comments_${itemType}_${itemId}_1_15`)
          let cachedDataApp = await getListComments(itemId, itemType, 1, 15, req)
          client.set(`comments_${itemType}_${itemId}_1_15`, JSON.stringify(cachedDataApp), 'EX', 60 * 60)
        }
      }
      return res.send(helper.sj(newCommentItem, req.status_token, 'Comment thành công!'))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // like comment
  router.post('/:comment_id/like', async (req, res) => {
    if (!req.user) {
      return res.send(helper.ej('Vui lòng đăng nhập để like comment', 401, false, 'Vui lòng đăng nhập để like comment'))
    }
    req.checkParams('comment_id', 'Item Id is required').notEmpty()
    req.checkParams('comment_id', 'Item Id không phù hợp').isInt()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let commentId = req.params.comment_id

    try {
      let comment = await app.models.ItemComment.findOne({
        where: {
          'id': commentId,
          'visible': true,
          'deleted_at': {
            $eq: null
          }
        },
        include: [{
          association: 'likes',
          attributes: ['id']
        }]
      })
      if (comment === null || comment.visible === 0) {
        return res.send(helper.ej('Comment không tồn tại, không thể like comment', 404, false, 'Comment không tồn tại, không thể like comment'))
      }
      let commentLikeItem = await app.models.ItemCommentLike.findOne({
        where: {
          comment_id: comment.id,
          user_id: req.user.id
        }
      })
      if (commentLikeItem === null) {
        let newCommentLikeData = {
          comment_id: comment.id,
          user_id: req.user.id
        }
        await app.models.ItemCommentLike.create(newCommentLikeData)
        comment = comment.toJSON()
        comment.likes = comment.likes.length + 1
        comment.isLike = true
        let client = await require('../../../config/client')
        if (client) {
          // Remove and make new cache data web
          let cachedDataWeb = await client.getAsync(`comments_${comment.commentable_type}_${comment.commentable_id}_1_12`)
          if (cachedDataWeb) {
            await client.del(`comments_${comment.commentable_type}_${comment.commentable_id}_1_12`)
            let cacheDataWeb = await getListComments(comment.commentable_id, comment.commentable_type, 1, 12, req)
            client.set(`comments_${comment.commentable_type}_${comment.commentable_id}_1_12`, JSON.stringify(cacheDataWeb), 'EX', 60 * 60)
          }
          // Remove and make new cache data web 2
          let cachedDataWeb2 = await client.getAsync(`comments_${comment.commentable_type}_${comment.commentable_id}_1_5`)
          if (cachedDataWeb2) {
            await client.del(`comments_${comment.commentable_type}_${comment.commentable_id}_1_5`)
            let cacheDataWeb2 = await getListComments(comment.commentable_id, comment.commentable_type, 1, 5, req)
            client.set(`comments_${comment.commentable_type}_${comment.commentable_id}_1_5`, JSON.stringify(cacheDataWeb2), 'EX', 60 * 60)
          }
        }
        return res.send(helper.sj(comment, req.status_token, 'Like thành công'))
      } else {
        await commentLikeItem.destroy()
        comment = comment.toJSON()
        comment.likes = comment.likes.length - 1
        comment.isLike = false
        let client = await require('../../../config/client')
        if (client) {
          // Remove and make new cache data web
          let cachedDataWeb = await client.getAsync(`comments_${comment.commentable_type}_${comment.commentable_id}_1_12`)
          if (cachedDataWeb) {
            await client.del(`comments_${comment.commentable_type}_${comment.commentable_id}_1_12`)
            let cacheDataWeb = await getListComments(comment.commentable_id, comment.commentable_type, 1, 12, req)
            client.set(`comments_${comment.commentable_type}_${comment.commentable_id}_1_12`, JSON.stringify(cacheDataWeb), 'EX', 60 * 60)
          }
          // Remove and make new cache data web 2
          let cachedDataWeb2 = await client.getAsync(`comments_${comment.commentable_type}_${comment.commentable_id}_1_5`)
          if (cachedDataWeb2) {
            await client.del(`comments_${comment.commentable_type}_${comment.commentable_id}_1_5`)
            let cacheDataWeb2 = await getListComments(comment.commentable_id, comment.commentable_type, 1, 5, req)
            client.set(`comments_${comment.commentable_type}_${comment.commentable_id}_1_5`, JSON.stringify(cacheDataWeb2), 'EX', 60 * 60)
          }
        }
        return res.send(helper.sj(comment, req.status_token, 'Unlike thành công'))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // delete comment
  router.post('/:comment_id/delete', async (req, res) => {
    if (!req.user) {
      return res.send(helper.ej('Vui lòng đăng nhập để xóa comment', 401, false, 'Vui lòng đăng nhập để xóa comment'))
    }
    req.checkParams('comment_id', 'Item Id is required').notEmpty()
    req.checkParams('comment_id', 'Item Id không phù hợp').isInt()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let commentId = req.params.comment_id
    try {
      let comment = await app.models.ItemComment.findOne({
        where: {
          'id': commentId
        },
        include: [{
          association: 'author'
        }]
      })
      if (comment === null || comment.visible === 0) {
        return res.send(helper.ej('Comment không tồn tại, không thể xóa comment', 404, false, 'Comment không tồn tại, không thể xóa comment'))
      }
      if (comment.author.id !== req.user.id) {
        return res.send(helper.ej('Bạn không có quyền xóa comment', 403, false, 'Không có quyền xóa comment'))
      }
      let itemId = comment.commentable_id
      let itemType = comment.commentable_type
      await comment.destroy()
      let client = await require('../../../config/client')
      if (client) {
        // Remove and make new cache data web
        let cachedDataWeb = await client.getAsync(`comments_${itemType}_${itemId}_1_12`)
        if (cachedDataWeb) {
          await client.del(`comments_${itemType}_${itemId}_1_12`)
          let cacheDataWeb = await getListComments(itemId, itemType, 1, 12, req)
          client.set(`comments_${itemType}_${itemId}_1_12`, JSON.stringify(cacheDataWeb), 'EX', 60 * 60)
        }
        // Remove and make new cache data web 2
        let cachedDataWeb2 = await client.getAsync(`comments_${itemType}_${itemId}_1_5`)
        if (cachedDataWeb2) {
          await client.del(`comments_${itemType}_${itemId}_1_5`)
          let cacheDataWeb2 = await getListComments(itemId, itemType, 1, 5, req)
          client.set(`comments_${itemType}_${itemId}_1_5`, JSON.stringify(cacheDataWeb2), 'EX', 60 * 60)
        }
      }
      return res.send(helper.sj(null, req.status_token, 'Xóa comment thành công'))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  async function getListComments(itemId, itemType, page, pageSize, req) {
    var totalComment = 0
    var pagination = {}
    var comments = []
    // Get Total Comment
    totalComment = await app.models.ItemComment.count({
      where: {
        'commentable_type': itemType,
        'commentable_id': parseInt(itemId),
        'visible': true,
        'parent_id': {
          $eq: null
        },
        'deleted_at': {
          $eq: null
        }
      }
    })
    // Pagination
    let pages = Math.ceil(totalComment / pageSize)
    let offset = pageSize * (page - 1)
    pagination = {
      page: page,
      pageSize: pageSize,
      rowCount: totalComment,
      pageCount: pages,
      itemLeft: totalComment - page * pageSize >= 0 ? totalComment - page * pageSize : 0,
      pageLeft: pages - page >= 0 ? pages - page : 0
    }

    // Get Comment
    if (totalComment !== 0) {
      comments = await app.models.ItemComment.findAll({
        where: {
          'commentable_type': itemType,
          'commentable_id': parseInt(itemId),
          'visible': true,
          'deleted_at': {
            $eq: null
          },
          'parent_id': {
            $eq: null
          }
        },
        order: [
          ['id', 'DESC']
        ],
        include: [{
          association: 'likes',
          attributes: ['id', 'user_id']
        },
        {
          association: 'author',
          attributes: ['id', 'name']
        },
        {
          association: 'children',
          required: false,
          where: {
            'visible': true,
            'deleted_at': {
              $eq: null
            }
          },
          include: [{
            association: 'likes',
            attributes: ['id', 'user_id']
          },
          {
            association: 'author',
            attributes: ['id', 'name']
          }
          ]
        }
        ],
        limit: pageSize,
        offset: offset
      })
      comments = comments.map(function (item) {
        item = item.toJSON()
        let isLike = false
        if (req.user) {
          item.likes.forEach(function (likeItem) {
            if (req.user.id === likeItem.user_id) {
              isLike = true
              return false
            }
          })
        }
        item.isLike = isLike
        item.likes = item.likes.length
        if (item.children.length > 0) {
          item.children = item.children.map(function (childrenItem) {
            let isLike = false
            if (req.user) {
              childrenItem.likes.forEach(function (likeItem) {
                if (req.user.id === likeItem.user_id) {
                  isLike = true
                  return false
                }
              })
            }
            childrenItem.isLike = isLike
            childrenItem.likes = childrenItem.likes.length
            return childrenItem
          })
        }
        return item
      })
    }

    return {
      totalComment: totalComment,
      comments: comments,
      pagination: pagination
    }
  }
  return router
}
