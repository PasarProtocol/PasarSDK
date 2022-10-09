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

const getChainTypeById = (chainId: number): ChainType => {
    if (chainId === 20 || chainId===21)
        return ChainType.ESC;
    if (chainId===1 || chainId===3)
        return ChainType.ETH;
    if (chainId===32659 || chainId===46688)
        return ChainType.FSN;
    return ChainType.ESC;
}

export {
    ChainType,
    getChainTypes,
    getChainTypeById
}
