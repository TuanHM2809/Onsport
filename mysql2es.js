let models = require('./server/models/index1')
const Promise = require('bluebird')
var Constant = require('./server/constants')
let _ = require('lodash')
let slug = require('slug')
let bulk = []
const ES = {
  host: 'localhost',
  port: '9200'
}
let bodySettings = {
  'index': {
    'analysis': {
      'analyzer': {
        'my_normalizer': {
          'tokenizer': 'icu_tokenizer',
          'filter': ['nfkc_normalizer']
        }
      },
      'tokenizer': {
        'my_normalizer': {
          'type': 'nGram',
          'token_chars': [
            'letter',
            'digit',
            'whitespace',
            'punctuation',
            'symbol'
          ]
        }
      },
      'filter': {
        'nfkc_normalizer': {
          'type': 'icu_normalizer',
          'name': 'nfkc'
        }
      }
    }
  }
}
let elasticsearch = require('elasticsearch')
let client = new elasticsearch.Client({
  host: `${ES.host}:${ES.port}`,
  log: 'trace'
})

client.indices.delete({
  index: 'onsports'
}).then(async () => {
  console.log('onsports index have been deleted!')
  await client.indices.create({
    index: 'onsports'
  })
  // // let []
  // await client.indices.close({ index: 'onsports' })
  // await client.indices.putSettings({
  //   body: bodySettings
  // })
  // await client.indices.open({ index: 'onsports' })
  let [posts, galleries, videos] = await Promise.all([
    models.Post.findAll({
      attributes: ['id', 'slug', 'title', 'content', 'short_title', 'short_description', 'created_at'],
      include: [{
        model: models.Category,
        as: 'categories',
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        }
      },
      {
        model: models.Tag,
        as: 'Tags',
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        }
      }
      ],
      where: {
        status: 'PUBLISHED',
        deleted_at: null,
        $or: [{
          date: {
            $lte: models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
          }
        },
        {
          date: null
        }
        ]
      }
    }),
    models.Gallery.findAll({
      atrributes: ['id', 'title', 'slug', 'content'],
      include: [{
        association: 'gallery_items',
        attributes: ['id', 'caption'],
        where: {
          visible: true
        },
        include: [{
          association: 'file',
          attributes: ['id', 'url', 'name'],
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
      where: {
        status: 'PUBLISHED',
        deleted_at: null
      }
    }),
    models.File.findAll({
      attributes: ['id', 'slug', 'name', 'content', 'created_at'],
      include: [{
        model: models.Category,
        as: 'categories',
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        }
      },
      {
        model: models.Tag,
        as: 'Tags',
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        }
      },
      {
        // Check type file
        association: 'type',
        where: {
          name: Constant.VIDEO_TYPE
        },
        required: true
      }
      ],
      where: {
        status: 'PUBLISHED',
        deleted_at: null,
        $or: [{
          date: {
            $lte: models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
          }
        },
        {
          date: null
        }
        ]
      }
    })
  ])

  posts = getFormedItems(posts)
  galleries = getFormedItems(galleries)
  videos = getFormedItems(videos)
  _.forEach([posts, galleries, videos], items => {
    _.forEach(items, item => {
      bulk.push({
        index: {
          _index: item._index,
          _type: item._type,
          _id: item._id
        }
      })
      delete item._index
      delete item._type
      delete item._id
      console.log(item)
      bulk.push(item)
    })
  })
  await client.bulk({
    body: bulk
  })
  await client.indices.close({ index: 'onsports' })
  await client.indices.putSettings({
    body: bodySettings
  })
  await client.indices.open({ index: 'onsports' })
  process.exit(0)
}).catch(async (e) => {
  console.log(e)
  try { 
    await client.indices.create({
      index: 'onsports'
    })
  } catch(e) {
    console.log(e)
  }
  process.exit(0)
})

function getFormedItems (listItems) {
  let items = _.map(listItems, item => {
    item = item.toJSON()
    item.tags = _.map(item.Tags, 'name')
    if (item.name) {
      item.title = item.name
    }
    item.categories = _.map(item.categories, 'name')
    item._id = item.id
    item['_index'] = 'onsports'
    if (_.isObject(item.type)) {
      item.type = Constant.FILE_TYPE
    }
    item['_type'] = item.type
    return _.pick(item, ['id', 'title', 'slug', 'content', 'short_title', 'short_description', 'type', 'tags', 'categories', '_type', '_id', '_index', 'created_at'])
  })
  return items
}
