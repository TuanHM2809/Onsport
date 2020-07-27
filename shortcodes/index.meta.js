// var should = require('should')
// var  = require('meta-shortcodes')
import ShortcodeParser from 'meta-shortcodes'
// import axios from 'axios'
var parser = ShortcodeParser()

parser.add('media', function (opts, content) {
  const fileId = opts.id || content || '0'
  const classList = opts.class
  const width = opts.width || ''
  const height = opts.height || ''
  const title = opts.title || ''
  return `<post-player class="${classList}" width="${width}" height="${height}"  fileId="${fileId}" title="${title}"></post-player>`
})

parser.add('gallery', function (opts, content) {
  const { id } = opts
  const title = opts.title || ''
  return `<gallery galleryId="${id}" title="${title}"/>`
})
export default (data) => parser.parse(data)
