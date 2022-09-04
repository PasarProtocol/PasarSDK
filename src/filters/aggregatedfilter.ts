import { Filter, FilterType } from "./filter"

enum AggregatedType {
    And = "And",
    Or = "Or"
}

class AggregatedFilter extends Filter {
    protected constructor(type: AggregatedType, filters: Filter[]) {
		if (type == AggregatedType.And)
			super(FilterType.AndAggregated, filters)
		else if (type == AggregatedType.Or)
			super(FilterType.OrAggregated, filters)
    }

	public setFilter(filters: Filter[]): AggregatedFilter {
		this.setBody(filters)
		return this
	}

	public appendFilter(filter: Filter): AggregatedFilter {
		if (filter == null)
			return this

		if (super.getBody() == null)
			super.setBody([filter])
		else
			(super.getBody() as Filter[]).push(filter)
	}
}

export {
    AggregatedType,
    AggregatedFilter
}
