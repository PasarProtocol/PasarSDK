import { Filter, FilterType} from "./filter";

class SensitiveFilter extends Filter {
    public constructor(sensitive: boolean) {
        super(FilterType.Sensitive, sensitive)
    }
}

export {
    SensitiveFilter
}
