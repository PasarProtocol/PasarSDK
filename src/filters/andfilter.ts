import { Filter } from "./filter";
import { AggregatedFilter, AggregatedType } from "./aggregatedfilter";

class AndFilter extends AggregatedFilter {
	public constructor(filters: Filter[]) {
		super(AggregatedType.And, filters)
	}
}

export {
	AndFilter
}
