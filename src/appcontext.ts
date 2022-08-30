import { CollectionAddress } from "./contractaddress";
import { ChainType } from "./chaintype";
import { NetworkType } from "./networkType";

export class AppContext {
    private network: NetworkType;
    private appDID: string;
    private appInstanceDID: string;

    private collections: Array<CollectionAddress>;

    public appendCollection(address: string, chain: ChainType) {
        this.collections.push(new CollectionAddress(address, chain));
    }

    public getCollections(): Array<CollectionAddress> {
        return this.collections;
    }
}