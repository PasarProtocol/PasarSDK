import { ItemType } from "../itemtype";
import { Filter, FilterType } from "./filter";

class ItemsFilter extends Filter {
    public constructor(types: ItemType[]) {
        super(FilterType.ItemTypes, types)
    }
}

export {
    ItemsFilter
}
