import { CollectionAddress } from "../contractaddress";
import { Filter, FilterType } from "./Filter";

class CollectionFilter extends Filter {
    public constructor(collections: CollectionAddress[]) {
        super(FilterType.Collections, collections)
    }
}

export {
    CollectionFilter
}
