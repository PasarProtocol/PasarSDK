import { CollectionAddress } from "../contractaddress";
import { Filter, FilterType } from "./Filter";

class TokenFilter extends Filter {
    public constructor(tokens: CollectionAddress) {
        super(FilterType.Tokens, tokens)
    }
}

export {
    TokenFilter
}
