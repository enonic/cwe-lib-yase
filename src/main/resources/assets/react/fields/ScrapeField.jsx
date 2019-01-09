import {FieldArray} from 'formik';
import {capitalize} from 'lodash';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const ScrapeField = ({path, setFieldValue, value}) => {
	//console.log(JSON.stringify({path, value}, null, 4));
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton classes='block' field={path} value={[{field: '', dataExpr: ''}]} setFieldValue={setFieldValue} text="Add scrape field"/>
	}
	return <Fieldset legend={capitalize(path)}>
		<FieldArray
			name={path}
			render={({insert, swap, remove}) => value.map(({field, dataExpr}, index) => (
				<div key={`${path}[${index}]`}>
					<LabeledField label="Field" name={`${path}[${index}].field`}/>
					<LabeledField label="Data extraction expression" name={`${path}[${index}].dataExpr`}/>
					<RemoveButton index={index} remove={remove}/>
					{index ? <MoveUpButton index={index} swap={swap}/> : null}
					{index < value.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
					<InsertButton index={index} insert={insert} value={{field: '', dataExpr: ''}}/>
				</div>
			))}
		/>
	</Fieldset>;
};
