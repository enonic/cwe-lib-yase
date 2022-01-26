import type {
	App,
	Log
} from '../../../../typeScript/globals.d';

//@ts-ignore
import {connect} from '/lib/xp/node';
//@ts-ignore
import * as repo from '/lib/xp/repo';
//@ts-ignore
import * as value from '/lib/xp/value';

//@ts-ignore
import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
//import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '../stemming/javaLocaleToSupportedLanguage';


declare global {
	const app :App;
	const log :Log;
}


export const javaBridge = {
	app,
	connect,
	log,
	repo,
	stemmingLanguageFromLocale,
	value
};
