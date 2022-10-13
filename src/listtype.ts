enum ListType {
    fixedPrice = "FixedPrice",
    onAuction = "OnAuction"
}

const getListTypes = (): ListType[] => {
    return [ListType.fixedPrice, ListType.onAuction]
}

const isOnAuction = (type:string): boolean => {
    return ListType.onAuction == type;
}

export {
    ListType,
    getListTypes,
    isOnAuction
}
