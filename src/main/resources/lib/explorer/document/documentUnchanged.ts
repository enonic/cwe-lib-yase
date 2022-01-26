import type {
	CreatedDocumentTypeNode,
	UpdatedNode
} from '../types';
import type {
	JavaBridge
} from './types';


import {
	enonify,
	toStr
} from '@enonic/js-utils';
import {detailedDiff} from 'deep-object-diff';
import * as Diff from 'diff';
import fastDeepEqual from 'fast-deep-equal';
import HumanDiff from 'human-object-diff';

import {FIELD_PATH_META} from '../constants';


const { diff: diffDocument } = new HumanDiff({
	objectName: 'document'
});


export function documentUnchanged(
	exisitingDocument :CreatedDocumentTypeNode,
	maybeChangedDocument :UpdatedNode,
	javaBridge :JavaBridge
) :boolean {
	const {log} = javaBridge;
	const id = exisitingDocument._id;
	const dereffedExisitingDocument = JSON.parse(JSON.stringify(exisitingDocument));
	const dereffedMaybeChangedDocument = JSON.parse(JSON.stringify(maybeChangedDocument));
	if (dereffedExisitingDocument[FIELD_PATH_META] && dereffedExisitingDocument[FIELD_PATH_META].modifiedTime) {
		delete dereffedExisitingDocument[FIELD_PATH_META].modifiedTime;
	}
	if (dereffedMaybeChangedDocument[FIELD_PATH_META] && dereffedMaybeChangedDocument[FIELD_PATH_META].modifiedTime) {
		delete dereffedMaybeChangedDocument[FIELD_PATH_META].modifiedTime;
	}
	if (fastDeepEqual(dereffedExisitingDocument, dereffedMaybeChangedDocument)) {
		log.debug(`No changes detected, not updating document with id:${id}`);
		return true;
	}

	// These will reflect modifiedTime, but that's ok?
	try {
		//log.debug(`Changes detected in document with id:${id}`);
		//log.debug(`Changes detected in document with id:${id} exisitingDocument:${toStr(exisitingDocument)} maybeChangedDocument:${toStr(maybeChangedDocument)}`);
		log.debug(`Changes detected in document with id:${id} diff:${toStr(detailedDiff(exisitingDocument, maybeChangedDocument))}`);
	} catch (e) {
		try {
			log.debug(`Changes detected in document with id:${id} diff:${toStr(diffDocument(exisitingDocument, maybeChangedDocument))}`);
		} catch (e) {
			try {
				log.debug(`Changes detected in document with id:${id} diff:${toStr(Diff.diffJson(exisitingDocument, maybeChangedDocument))}`);
			} catch (e) {
				// No-op :)
			} // catch3
		} // catch2
	} // catch1
	return false;
}
