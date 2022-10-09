enum ChainType {
    ESC = "Elastos Smart Chain",
    FSN = "Fusion",
    ETH = "Ethereum"
}

const getChainTypes = (): string[] => {
    return [
        ChainType.ESC,
        ChainType.ETH,
        ChainType.FSN
    ]
}

export {
    ChainType,
    getChainTypes
}
