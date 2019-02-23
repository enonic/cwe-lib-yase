/* eslint-disable no-console */
//──────────────────────────────────────────────────────────────────────────────
// Imports
//──────────────────────────────────────────────────────────────────────────────
import glob from 'glob';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'; // Supports ECMAScript2015


//──────────────────────────────────────────────────────────────────────────────
// Functions
//──────────────────────────────────────────────────────────────────────────────
//const toStr = v => JSON.stringify(v, null, 4);
const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));


//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
const MODE = 'development';
//const MODE = 'production';
const EXTENSIONS_GLOB = '{es,js}';
const SRC_DIR = 'src/main/resources';
const SRC_DIR_ABS = path.resolve(__dirname, SRC_DIR);
const SRC_ASSETS_DIR_ABS = path.resolve(SRC_DIR_ABS, 'assets');

const DST_DIR = 'build/resources/main';
const DST_DIR_ABS = path.join(__dirname, DST_DIR);
const DST_ASSETS_DIR_ABS = path.join(DST_DIR_ABS, 'assets');

const ASSETS_GLOB = `${SRC_DIR}/{site/assets,assets}/**/*.${EXTENSIONS_GLOB}`;
//console.log(`ASSETS_GLOB:${toStr(ASSETS_GLOB)}`);
//console.log(`ASSET_FILES:${toStr(glob.sync(ASSETS_GLOB))}`);

const FILES = glob.sync(`${SRC_DIR}/**/*.${EXTENSIONS_GLOB}`, {ignore: ASSETS_GLOB});
if (!FILES.length) {
	console.error('Webpack did not find any files to process!');
	process.exit();
}
//console.log(`FILES:${toStr(FILES)}`);
if (!FILES.length) {
	console.error('Webpack did not find any files to process!');
	process.exit();
}

const STATS = {
	colors: true,
	hash: false,
	maxModules: 0,
	modules: false,
	moduleTrace: false,
	timings: false,
	version: false
};

//──────────────────────────────────────────────────────────────────────────────
// Server-side Javascript
//──────────────────────────────────────────────────────────────────────────────
const SERVER_JS_ENTRY = dict(FILES.map(k => [
	k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
	`.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
]));
//console.log(`SERVER_JS_ENTRY:${toStr(SERVER_JS_ENTRY)}`); process.exit();

const SERVER_JS_CONFIG = {
	context: SRC_DIR_ABS,
	entry: SERVER_JS_ENTRY,
	externals: [
		/^\//
	],
	devtool: false, // Don't waste time generating sourceMaps
	mode: MODE,
	module: {
		rules: [{
			test: /\.(es6?|js)$/, // Will need js for node module depenencies
			use: [{
				loader: 'babel-loader',
				options: {
					babelrc: false, // The .babelrc file should only be used to transpile config files.
					comments: false,
					compact: false,
					minified: false,
					plugins: [
						'@babel/plugin-proposal-object-rest-spread',
						'@babel/plugin-transform-object-assign',
						'array-includes',
						'transform-es2017-object-entries',
					],
					presets: ['@babel/preset-env']
				} // options
			}] // use
		}] // rules
	}, // module
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				parallel: true, // highly recommended
				sourceMap: false
			})
		]
	},
	output: {
		path: DST_DIR_ABS,
		filename: '[name].js',
		libraryTarget: 'commonjs'
	}, // output
	resolve: {
		alias: {
			'/content-types': path.resolve(__dirname, SRC_DIR, 'site/content-types/index.es'),
			'/lib': path.resolve(__dirname, SRC_DIR, 'lib')
		},
		extensions: ['.es', '.js', '.json']
	}, // resolve
	stats: STATS
};


//──────────────────────────────────────────────────────────────────────────────
// Client-side Javascript
//──────────────────────────────────────────────────────────────────────────────
const CLIENT_JS_CONFIG = {
	context: SRC_ASSETS_DIR_ABS,
	entry: './react/index.jsx',
	externals: [
		//'react'
	],
	devtool: false, // Don't waste time generating sourceMaps
	mode: MODE,
	module: {
		rules: [{
			test: /\.jsx$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader',
				options: {
					babelrc: false, // The .babelrc file should only be used to transpile config files.
					comments: false,
					compact: false,
					minified: false,
					plugins: [
						'@babel/plugin-proposal-object-rest-spread',
						'@babel/plugin-transform-object-assign',
						'array-includes'
					],
					presets: [
						'@babel/preset-env',
						'@babel/preset-react'
					]
				} // options
			}]
		}]
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				parallel: true, // highly recommended
				sourceMap: false/*,
				uglifyOptions: {
					mangle: false, // default is true?
					keep_fnames: true // default is false?
				}*/
			})
		]
	},
	output: {
		//filename: '[name].js',
		filename: 'yase.js',
		library: 'yase',
		libraryTarget: 'umd',
		path: DST_ASSETS_DIR_ABS
	},
	plugins: [
		new CopyWebpackPlugin([
			//{ from: 'babel-standalone/', to: 'babel-standalone/' },
			{ from: 'formik/dist/formik.umd*', to: 'formik/[name].[ext]' },
			{ from: 'react/umd/react.*.js', to: 'react/[name].[ext]' },
			{ from: 'react-dom/umd/react-dom.*.js', to: 'react-dom/[name].[ext]' },
			//{ from: 'redux/dist/', to: 'redux/' }
		], {
			context: path.resolve(__dirname, 'node_modules')
		})
	],
	resolve: {
		extensions: ['.es', '.js', '.jsx']
	},
	stats: STATS
};
//console.log(`CLIENT_JS_CONFIG:${toStr(CLIENT_JS_CONFIG)}`); process.exit();

const WEBPACK_CONFIG = [
	SERVER_JS_CONFIG,
	CLIENT_JS_CONFIG
];
//console.log(`WEBPACK_CONFIG:${toStr(WEBPACK_CONFIG)}`);
//process.exit();

export { WEBPACK_CONFIG as default };
