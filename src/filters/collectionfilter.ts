import { CollectionAddress } from "../contractaddress";
import { Filter, FilterType } from "./filter";

class CollectionFilter extends Filter {
    public constructor(collections: CollectionAddress[]) {
        super(FilterType.Collections, collections)
    }
}

export {
    CollectionFilter
}
