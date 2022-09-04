import { CollectionAddress } from "../contractaddress";
import { Filter, FilterType } from "./filter";

class TokenFilter extends Filter {
    public constructor(tokens: CollectionAddress) {
        super(FilterType.Tokens, tokens)
    }
}

export {
    TokenFilter
}
