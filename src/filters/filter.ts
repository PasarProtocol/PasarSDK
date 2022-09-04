enum FilterType {
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

export {
    Filter,
    FilterType
}
