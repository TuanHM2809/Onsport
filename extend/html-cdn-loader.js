import apiConfig from '~/api.config.js'
const isProdMode = Object.is(process.env.NODE_ENV, 'production')

export default{
  progressImage: imageUrl => {
    if (isProdMode) {
      imageUrl = imageUrl.replace(imageUrl, `${apiConfig.cdnUrl}/url=${imageUrl}`)
    }
    return imageUrl
  },
  cdnUrl: source => {
    if (isProdMode) {
      source = source.replace(/src="\/images\//g, `src="${apiConfig.cdnUrl}/images/`)
    }
    return source
  }
}
