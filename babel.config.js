module.exports = {
  'presets': [
    '@babel/preset-env',
    'backpack-core/babel',
    'vue',
    '@vue/app'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]
}
