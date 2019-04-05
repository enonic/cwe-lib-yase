import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {insertAdjacentHTML} from '/lib/enonic/yase/insertAdjacentHTML';


export function editSynonymPage({
	path
}, {
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	relPath = path.replace(TOOL_PATH, ''),
	pathParts = relPath.match(/[^/]+/g),
	thesaurusName = pathParts[1],
	synonymId = pathParts[2]
} = {}) {
	log.info(toStr({
		path, relPath, pathParts, synonymId
	}));

	const node = connection.get(synonymId);
	log.info(toStr({node}));

	const {displayName, from, to} = node;
	log.info(toStr({displayName, from, to}));

	const fromInput = '<input class="block" name="from" type="text"/>';
	const toInput = '<input class="block" name="to" type="text"/>';

	return htmlResponse({
		main: `
<form
	action="${TOOL_PATH}/thesauri/${thesaurusName}"
	autocomplete="off"
	class="ui form"
	method="POST"
	style="width: 100%;"
>
	<div class="ui header">Edit synonym ${displayName}</div>
	<input name="id" type="hidden" value="${synonymId}"/>
	<div class="grouped fields">
		<div class="field">
			<label>From</label>
			${forceArray(from).map(value => `<input class="block" name="from" type="text" value="${value}"/>`).join('\n')}
			<button class="ui icon button" type="button" onClick="${insertAdjacentHTML(fromInput)}"><i class="green plus icon"></i></button>
		</div>
		<div class="field">
			<label>To</label>
			${forceArray(to).map(value => `<input class="block" name="to" type="text" value="${value}"/>`).join('\n')}
			<button class="ui icon button" type="button" onClick="${insertAdjacentHTML(toInput)}"><i class="green plus icon"></i></button>
		</div>
		<div class="field">
			<button class="ui primary button" type="submit"><i class="save icon"></i>Update synonym</button>
		</div>
	</div>
</form>`,
		path,
		title: `Edit synonym ${displayName}`
	});
}
