import {deepStrictEqual} from 'assert';

//import libExplorer from '../../../../build/swc/main/resources/lib/explorer/index.js';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
//} from '../../../../build/esbuild/esm/lib/explorer/index.mjs';
//} from '../../../../build/tsc/lib/explorer/index.js';
} from '../../../../build/rollup/index.mjs';
//} from '../../../../build/rollup/index.umd.js';
//} from '../../../../build/rollup/index.cjs';

/*const {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} = libExplorer;*/

const {cleanData} = document;

const log = { //console.log console.trace
	debug: () => {/**/},
	//debug: (...s) => console.debug('DEBUG', ...s),
	error: () => {/**/},
	//error: (...s) => console.error('ERROR', ...s),
	info: () => {/**/},
	//info: (...s) => console.info('INFO ', ...s),
	warning: () => {/**/}
	//warning: (...s) => console.warn('WARN ', ...s)
};

describe('document', () => {
	describe('cleanData()', () => {
		it(`cleanData() removes ${FIELD_PATH_GLOBAL} and ${FIELD_PATH_META}`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString',
					myObject: {
						myProperty: 'myObject.myProperty'
					}
				},
				cleanData({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: 'myObject.myProperty'
						}
					}
				}/*, {
					log
				}*/)
			);
		}); // it

		it(`cleanData({cleanExtraFields: true}) removes myObject`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString'
				},
				cleanData({
					cleanExtraFields: true,
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: 'myObject.myProperty'
						}
					},
					fieldsObj: {
						'myString': {
							valueType: 'string'
						}
					}
				}, {
					log
				})
			);
		});

		it(`cleanData({cleanExtraFields: true}) removes myObject.myProperty`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString',
					myObject: {}
				},
				cleanData({
					cleanExtraFields: true,
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: {
								myNestedProperty: 'myNestedPropertyValue'
							}
						}
					},
					fieldsObj: {
						'myString': {
							valueType: 'string'
						},
						'myObject': {
							valueType: 'set'
						}
					}
				}, {
					log
				})
			);
		});

		it(`cleanData({cleanExtraFields: true}) removes myObject.myProperty.myNestedProperty`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString',
					myObject: {
						myProperty: {}
					}
				},
				cleanData({
					cleanExtraFields: true,
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: {
								myNestedProperty: 'myNestedPropertyValue'
							}
						}
					},
					fieldsObj: {
						'myString': {
							valueType: 'string'
						},
						'myObject': {
							valueType: 'set'
						},
						'myObject.myProperty': {
							valueType: 'set'
						}
					}
				}, {
					log
				})
			);
		});
	}); // describe cleanData
}); // describe document
