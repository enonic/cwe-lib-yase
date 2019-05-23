//import {toStr} from '/lib/util';
import {serviceUrl} from '/lib/xp/portal';

import {htmlResponse} from '/lib/explorer/admin/htmlResponse';
import {menu} from '/lib/explorer/admin/collections/menu';
import {query} from '/lib/explorer/journal/query';


const ID_REACT_JOURNALS_CONTAINER = 'reactJournalsContainer';


export const journal = ({
	path
}) => {
	const propsObj = {
		serviceUrl: serviceUrl({
			service: 'journals'/*,
			params: {
				perPage: 10,
				page: 1,
				query: '',
				sort: 'endTime DESC'
			}*/
		})
	};
	const propsJson = JSON.stringify(propsObj);
	return htmlResponse({
		bodyBegin: [
			menu({path})
		],
		bodyEnd: [
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Journals, ${propsJson}),
		document.getElementById('${ID_REACT_JOURNALS_CONTAINER}')
	);
</script>`
		],
		main: `<div id="${ID_REACT_JOURNALS_CONTAINER}"/>`,
		path,
		title: 'Journal'
	})
} // history
