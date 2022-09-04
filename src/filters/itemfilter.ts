import { ItemType } from "../itemtype";
import { Filter, FilterType } from "./Filter";

class ItemsFilter extends Filter {
    public constructor(types: ItemType[]) {
        super(FilterType.ItemTypes, types)
    }
}

export {
    ItemsFilter
}
