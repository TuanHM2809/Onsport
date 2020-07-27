module.exports = {
  webpack: (config, options, webpack) => {
    config.plugins[0] = new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : JSON.stringify('development'),
      '__DEV__': process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    })
    config.entry.main = './server/index.js'
    return config
  }
}
