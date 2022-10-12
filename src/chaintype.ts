import { Chain } from "pretend";

enum ChainType {
    ESC = "ESC",
    ETH = "ETH",
    FSN = "FSN"
}

const chainTypes: ChainType[] = [
    ChainType.ESC,
    ChainType.ETH,
    ChainType.FSN
]

const getChainTypes = (): string[] => {
    return chainTypes;
}

const chainIdMapType = new Map<number, ChainType>([
    [20,    ChainType.ESC],
    [21,    ChainType.ESC],
    [1,     ChainType.ETH],
    [3,     ChainType.ETH],
    [32659, ChainType.FSN],
    [46688, ChainType.FSN]
]);

const getChainTypeById = (chainId: number): ChainType => {
    return chainIdMapType[chainId]
}

export {
    ChainType,
    getChainTypes,
    getChainTypeById
}
