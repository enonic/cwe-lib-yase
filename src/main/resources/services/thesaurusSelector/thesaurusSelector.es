import {toStr} from '/lib/enonic/util';
import {connect} from '/lib/xp/node';


const BRANCH_ID = 'master';

const APP_YASE = 'com.enonic.admin.yase';
const NT_THESAURUS = `${APP_YASE}:thesaurus`;
const REPO_ID = APP_YASE;


const CONNECTION = connect({
	repoId: REPO_ID,
	branch: BRANCH_ID
});


function getThesauri(key) {
	//log.info(toStr({key}));
	const node = CONNECTION.get(key);
	//log.info(toStr({node}));
	//const id = node._path.replace(/^\/thesauri/, '');
	const {_name: id, displayName, description} = node;
	return {id, displayName, description};
}


export function get({
	params: {
		count,
		ids = '[]', // NOTE Json
		query = '',
		start
	}
}) {
	log.info(toStr({
		count, ids, query, start
	}));
	if (ids) {
		const idArray = JSON.parse(ids);
		if (idArray.length) {
			return {
				body: {
					count: ids.length,
					total: ids.length,
					hits: idArray.map(id => getThesauri(`/thesauri${id}`))
				},
				contentType: 'text/json; charset=utf-8'
			};
		}
	} // if ids
	const queryParams = {
		count,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_THESAURUS]
					}
				}]
			}
		},
		query: query
			.split(' ')
			.map(word => `(
				fulltext('_name^7, displayName^5, description^3, _allText^1', '${word}', 'OR')
				OR ngram('_name^6, displayName^4, description^2, _allText', '${word}', 'OR')
			)`)
			.join(' AND ')
			.replace(/\n\s*/g, ' ')
			.trim(),
		start
	}; //log.info(toStr({queryParams}));
	const result = CONNECTION.query(queryParams); //log.info(toStr({result}));
	const body = {
		count: result.count,
		total: result.total,
		hits: result.hits.map(({id}) => getThesauri(id))
	}; //log.info(toStr({body}));
	return {
		body,
		contentType: 'text/json; charset=utf-8'
	};
}
