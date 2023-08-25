module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 75,
      propList: ['*'],
      selectorBlackList: ['norem'],
      minPixelValue: 2,
      exclude: function (file) {
        return file.indexOf('src/h5') === -1
      }
    }
  }
}
