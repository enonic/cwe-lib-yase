import type {Application} from '../../../index.d';
import type {TaskName} from './Task.d';
import type {AnyObject} from './Utility.d';

//──────────────────────────────────────────────────────────────────────────────
// Collector UI
//──────────────────────────────────────────────────────────────────────────────
export type CollectorComponentResetFunction = () => void;

export type CollectorComponentValidateFunction<
	CollectorConfig extends AnyObject = AnyObject
> = (collectorConfig :CollectorConfig) => boolean

export type CollectorComponentImperativeHandle<
	CollectorConfig extends AnyObject = AnyObject
> = {
	reset :CollectorComponentResetFunction
	validate :CollectorComponentValidateFunction<CollectorConfig>
};

export type CollectorComponentRef<
	CollectorConfig extends AnyObject = AnyObject
> = React.MutableRefObject<
	CollectorComponentImperativeHandle<
		CollectorConfig
	>
>

export type ContentTypeOptions = Array<unknown>;

export type Fields = Record<string,{
	label :string
	values :Record<string,{
		label :string
	}>
}>;

export type SiteOptions = Array<unknown>;

export type CollectorProps<
	CollectorConfig extends AnyObject = AnyObject
> = {
	collectorConfig: CollectorConfig
	explorer :{
		contentTypeOptions :ContentTypeOptions
		fields :Fields
		siteOptions :SiteOptions
	}
	initialCollectorConfig :CollectorConfig
	setCollectorConfig :(collectorConfig: CollectorConfig) => void
	setCollectorConfigErrorCount :(collectorConfigErrorCount :number) => void
};

//──────────────────────────────────────────────────────────────────────────────
// Collector API
//──────────────────────────────────────────────────────────────────────────────

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
