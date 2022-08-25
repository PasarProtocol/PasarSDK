import { ChainNetwork } from "./chainnetwork";

export class CollectionAddress {
    private contractAddr: string;
    private chain: ChainNetwork

    constructor(addr: string, chain: ChainNetwork) {
        this.contractAddr = addr;
        this.chain = chain;
    }

    public getContractAddr(): string {
        return this.contractAddr;
    }

    public getChainNetwork(): ChainNetwork {
        return this.chain;
    }
}
