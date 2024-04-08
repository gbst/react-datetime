const paths = require('./paths');
const path = require('path');

const outputPath = path.join(__dirname, '../dist/');

// fix 0308010C:digital envelope routines::unsupported
// webpack 5.54+ fix this
const crypto = require('crypto');
const cryptoOrigCreateHash = crypto.createHash;
crypto.createHash = algorithm => cryptoOrigCreateHash(algorithm === 'md4' ? 'sha256' : algorithm);

const baseConfig = {
	entry: ['./src/DateTime.js'],
	mode: 'production',

	resolve: {
		extensions: ['.js']
	},

	externals: {
		'react': 'react',
		'react-dom': 'react-dom',
		'moment': 'moment',
		'moment-timezone': 'moment-timezone'
	},

	module: {
		rules: [
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				include: paths.appSrc,
				loader: require.resolve('babel-loader')
			}
		]
	},
	devtool: 'source-map'
};

const umdConfig = {
	...baseConfig,
	output: {
		path: outputPath,
		library: 'Datetime',
		libraryTarget: 'umd',
		filename: 'react-datetime.umd.js',
		auxiliaryComment: 'React datetime',
		libraryExport: 'default'
	}
};

const cjsConfig = {
	...baseConfig,
	output: {
		path: outputPath,
		library: 'Datetime',
		libraryTarget: 'commonjs2',
		filename: 'react-datetime.cjs.js',
		auxiliaryComment: 'React datetime'
	}
};

module.exports = [ umdConfig, cjsConfig ];
