//import {toStr} from '/lib/util';
import {serviceUrl} from '/lib/xp/portal';

import {PRINCIPAL_YASE_READ} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {query as queryCollections} from '/lib/enonic/yase/collection/query';
import {connect} from '/lib/enonic/yase/repo/connect';
import {query as getThesauri} from '/lib/enonic/yase/thesaurus/query';

const ID_REACT_SEARCH_CONTAINER = 'reactSearchContainer';


export function toolPage({
	path
}) {
	const connection = connect({principals: PRINCIPAL_YASE_READ});
	const collectionHits = queryCollections({connection}).hits;
	const propsObj = {
		collectionOptions: collectionHits.map(({displayName: label, _name: value}) => ({label, value})),
		initialValues: {
			collections: collectionHits.map(({_name}) => _name),
			thesauri: []
		},
		serviceUrl: serviceUrl({
			service: 'search',
			params: {
				interface: 'helsebiblioteket' // TODO
			}
		}),
		thesaurusOptions: getThesauri({connection}).hits.map(({displayName, name}) => ({label: displayName, value: name}))
	};
	//log.info(toStr({propsObj}));
	const propsJson = JSON.stringify(propsObj);
	return htmlResponse({
		bodyEnd: [
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Search, ${propsJson}),
		document.getElementById('${ID_REACT_SEARCH_CONTAINER}')
	);
</script>`],
		main: `<div id="${ID_REACT_SEARCH_CONTAINER}"/>`,
		path
	});
}
