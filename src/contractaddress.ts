import { ChainType } from "./chaintype";

export class CollectionAddress {
    private contractAddr: string;
    private chain: ChainType

    constructor(addr: string, chain: ChainType) {
        this.contractAddr = addr;
        this.chain = chain;
    }

    public getContractAddr(): string {
        return this.contractAddr;
    }

    public getChain(): ChainType {
        return this.chain;
    }
}
