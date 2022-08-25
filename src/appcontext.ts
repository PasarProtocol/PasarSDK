import { ChainNetwork } from "./chainnetwork";
import { CollectionAddress } from "./contractaddress";

export class AppContext {
    private appDID: string;
    private appInstanceDID: string;

    private collections: Array<CollectionAddress>;

    public appendCollection(address: string, chain: ChainNetwork) {
        this.collections.push(new CollectionAddress(address, chain));
    }

    public getCollections(): Array<CollectionAddress> {
        return this.collections;
    }
}