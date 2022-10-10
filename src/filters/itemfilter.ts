import { ERCType } from "../erctype";
import { Filter, FilterType } from "./filter";

class ItemsFilter extends Filter {
    public constructor(types: ERCType[]) {
        super(FilterType.ItemTypes, types)
    }
}

export {
    ItemsFilter
}
