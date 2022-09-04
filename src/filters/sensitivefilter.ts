import { Filter, FilterType} from "./Filter";

class SensitiveFilter extends Filter {
    public constructor(sensitive: boolean) {
        super(FilterType.Sensitive, sensitive)
    }
}

export {
    SensitiveFilter
}
