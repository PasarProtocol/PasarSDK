
export enum ChainType {
    ESC = "Elastos Smart Chain",
    FSN = "Fusion",
    ETH = "Ethereum"
}

export class ChainTypes {
    public getChainTypes(): Array<string> {
        let returnValue = [
            ChainType.ESC,
            ChainType.ETH,
            ChainType.FSN
        ]

        return returnValue;
    }
}