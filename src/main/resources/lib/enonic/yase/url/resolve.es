//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {resolve as _resolve} from 'uri-js';

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP imports (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/util';


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function resolve({base, uri}) {
	//log.info(toStr({base, uri}));
	return _resolve(base, uri);
}
