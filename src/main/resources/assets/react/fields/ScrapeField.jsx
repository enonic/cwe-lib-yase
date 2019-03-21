import {connect, Field, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';

import {FieldSelector} from './FieldSelector';
import {ScrapeExpressionBuilder} from './ScrapeExpressionBuilder';
import {TagSelector} from './TagSelector';

import {toStr} from '../utils/toStr';


export const ScrapeField = connect(({
	formik: {
		values
	},
	fields = [],
	fieldsObj, // {}
	name = 'scrape',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	tags = [],
	value = getIn(values, path) || undefined
}) => {
	/*console.debug(toStr({
		component: 'ScrapeField',
		parentPath,
		value//,
		//values
	}));*/

	const tagsPath = `${parentPath}.tags`;
	//console.log(JSON.stringify({tagsPath}, null, 4));

	const tagsArray = getIn(values, tagsPath) || [{field: '', tags: []}];

	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton
			className='block'
			field={path}
			value={[{field: ''}]}
			text="Scrape HTML/XML"/>
	}
	return <Fieldset legend="Scrape HTML/XML">
		<Table headers={['Field', 'Type', 'Options', 'Actions']}>
			<FieldArray
				name={path}
				render={() => value.map(({
					field,
					option = 'scrape',
					tags: selectedTags = []
				}, index) => <tr key={`${path}[${index}]`}>
					<td>
						<FieldSelector
							name={`${path}[${index}].field`}
							fields={fields}
							value={field}
						/>
					</td>
					<td>
						<Select
							path={`${path}[${index}].option`}
							options={[{
								label: 'Scrape',
								value: 'scrape'
							}, {
								label: 'Tag',
								value: 'tag'
							}]}
							value={option}
						/>
					</td>
					<td>
						{option === 'scrape'
							? <ScrapeExpressionBuilder
								parentPath={`${path}[${index}]`}
							/>
							: field
								? <TagSelector
									label=""
									multiple={true}
									path={`${path}[${index}].tags`}
									tags={tags[field]}
									value={selectedTags}
								/>
								: null
						}
					</td>
					<td>
						<InsertButton index={index} path={path} value={{field: ''}}/>
						<RemoveButton index={index} path={path}/>
						<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
						<MoveUpButton index={index} path={path} visible={value.length > 1}/>
					</td>
				</tr>)}
			/>
		</Table>
	</Fieldset>;
});
