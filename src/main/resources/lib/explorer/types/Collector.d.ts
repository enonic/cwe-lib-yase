import type {Application} from '../../../index.d';
import type {TaskName} from './Task.d';


export type CollectorId = string


export type CollectorReactComponentParams = {
	context :{
		values :unknown
	}
	dispatch :() => void
	path :string
}

export type Collector = {
	appName :Application.Key
	collectTaskName :TaskName
	componentPath :string
	configAssetPath :string
	displayName :string
}
