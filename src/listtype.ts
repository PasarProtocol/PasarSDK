enum ListTypes {
    fixedPrice = "FixedPrice",
    onAuction = "OnAuction"
}

const getListTypes = (): ListTypes[] => {
    return [ListTypes.fixedPrice, ListTypes.onAuction]
}

const isOnAuction = (type:string): boolean => {
    return ListTypes.onAuction == type;
}

export {
    ListTypes,
    getListTypes,
    isOnAuction
}
