const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}),
	addLessLoader({
		lessOptions: {
			javascriptEnabled: true,
			// modifyVars:  { '@primary-color': '#1DA57A' } // 修改主题色
		}
    }),
    (config)=>{
        config.output.chunkFilename = 'static/js/[name].min.js'
        // config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
        // 去掉打包生产map 文件
        if(process.env.NODE_ENV==="production") config.devtool=false;
        return config
      }
)
