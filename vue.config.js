module.exports = {
    publicPath: "",
    lintOnSave: 'warning',
    chainWebpack: config => config.resolve.set('symlinks', false),
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ]
};
