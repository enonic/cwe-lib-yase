//import {parse as parseCookie} from 'cookie';

import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {list as listTasks, submitNamed} from '/lib/xp/task';
import {request as httpClientRequest} from '/lib/http-client';
//import {serviceUrl} from '/lib/xp/portal';

import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {getCollection} from '/lib/enonic/yase/admin/collections/getCollection';
import {collectionsPage} from '/lib/enonic/yase/admin/collections/collectionsPage';
import {getTasksWithPropertyValue} from '/lib/enonic/yase/task/getTasksWithPropertyValue';


import {TASK_COLLECT} from '/lib/enonic/yase/constants';



export const handleCollectionAction = ({
	path,
	method,
	/*headers: {
		Cookie: cookieHeader
	}*/
	params
}) => {
	//log.info(toStr({path, method, cookieHeader}));

	//const cookies = parseCookie(cookieHeader);
	//log.info(toStr({cookies}));

	//const sessionId = cookies.JSESSIONID;
	//log.info(toStr({sessionId}));

	const relPath = path.replace(TOOL_PATH, '');

	const pathParts = relPath.match(/[^/]+/g);
	const collectionName = pathParts[1];
	const action = pathParts[2];
	//log.info(toStr({collectionName, action}));

	if(action === 'collect') {
		const runningTasksWithName = getTasksWithPropertyValue({value: collectionName, state: 'RUNNING'});
		if (runningTasksWithName.length) {
			const alreadyRunningtaskId = runningTasksWithName[0].id;
			//log.info(toStr({alreadyRunningtaskId}));
		} else {
			const collectionNode = getCollection({name: collectionName});
			//log.info(toStr({collectionNode}));

			const {
				_name: name,
				collector: {
					config
				}
			} = collectionNode;
			//log.info(toStr({name, config}));
			if (params.resume === 'true') {
				config.resume = true;
			}

			const configJson = JSON.stringify(config);
			//log.info(toStr({configJson}));

			/*const url = serviceUrl({
				service: 'collect',
				application: 'com.enonic.yase.collector.surgeon',
				params: {
					name,
					configJson
				},
				type: 'absolute'
			});
			log.info(toStr({url}));

			const reqParams = {
				headers: {
					Cookie: `JSESSIONID=${sessionId}`
				},
				url
				//contentType: 'application/json'
			};
			log.info(toStr({reqParams}));

			const response = httpClientRequest(reqParams);
			log.info(toStr({response}));*/

			const submitNamedParams = {
				name: TASK_COLLECT,
				config: {
					name,
					configJson
				}
			};
			//log.info(toStr({submitNamedParams}));

			const taskId = submitNamed(submitNamedParams);
			//log.info(toStr({taskId}));
		}
	} else if (action === 'delete') {
		const messages = [];
		let status = 200;
		const {typedCollectionName} = params;
		if (!typedCollectionName) {
			messages.push('Missing required parameter "typedCollectionName"!');
			status = 400;
		} else if (typedCollectionName !== collectionName) {
			messages.push(`Typed collection name: "${typedCollectionName}" doesn't match actual collection name: "${collectionName}"!`);
			status = 400;
		} else {
			const connection = connectRepo({
				repoId: REPO_ID,
				branch: BRANCH_ID
			});
			const nodePath = `/collections/${collectionName}`;
			const deleteRes = connection.delete(nodePath);
			if(deleteRes) {
				messages.push(`Collection with path:${nodePath} deleted.`)
			} else {
				messages.push(`Something went wrong when trying to delete collection with path:${nodePath}.`)
				status = 500;
			}
		}
		return collectionsPage({path}, {
			messages,
			status
		});
	}
}; // handleCollectionAction
