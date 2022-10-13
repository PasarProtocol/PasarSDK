enum FilterType {
    Empty = "Empty",
    ListedStatus = "Listed status",
    PriceRange = "PrinceRange",
    Collections = "Collections",
    ItemTypes = "ItemTypes",
    Tokens = "Tokens",
    Sensitive = "Sensitve",
    Blockchains = "Blockchains",
    OrAggregated = "Or",
    AndAggregated = "And",
}

class Filter {
    private type: FilterType;
    private body: any;

    protected constructor(type: FilterType, body: any) {
        this.type = type
        this.body = body
    }

    protected setBody(value: any) {
        this.body = value
    }

    protected getBody(): any{
        return this.body
    }
}

class EmptyFilter extends Filter {
    constructor() {
        super(FilterType.Empty, null);
    }
}

export {
    FilterType,
    Filter,
    EmptyFilter,
}
