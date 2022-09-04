import { Filter } from "./filter";
import { AggregatedFilter, AggregatedType } from "./aggregatedfilter";

class OrFilter extends AggregatedFilter {
	public constructor(filters: Filter[]) {
		super(AggregatedType.Or, filters)
	}
}

export {
	OrFilter
}
