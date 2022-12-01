import type {Glue} from '../utils/Glue'


import {
	GraphQLFloat
	//@ts-ignore
} from '/lib/graphql';


export function addMatchAll({glue} :{glue :Glue}) {
	return glue.addInputType({
		name: 'QueryDSLExpressionMatchAll',
		fields: {
			boost: { type: GraphQLFloat }
		}
	});
}
