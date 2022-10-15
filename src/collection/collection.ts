import { Filter } from "../filters/filter";
import { NftItem } from "../nftitem";
import { AppContext } from "../appcontext";
import { CollectionInfo } from "./collectioninfo";
import { ContractAddress } from "../contractaddress";

class Collection {
    private appContext: AppContext;
    private info: CollectionInfo;

    constructor(collecionInfo: CollectionInfo) {
        this.info = collecionInfo;
    }

    public getContractAddress(): ContractAddress {
        return new ContractAddress(this.info.constractAddr, this.info.network);
    }

    public getOwnerdDid(): string {
        return this.info.createdDid;
    }

    public getOwnerAddr(): string {
        return this.info.createdAddr;
    }

    public getName(): string {
        return this.info.name;
    }

    public getSymbol(): string {
        return this.info.symbol;
    }

    public getAvatar(): string {
        return this.info.avatar;
    }

    public getDescritpion(): string {
        return this.info.description;
    }

    public getErcType(): string {
        return this.info.ercType;
    }

    public getCategory(): string {
        return this.info.category;
    }

    public getSocialLinks(): string[] {
        return this.info.socialLinks;
    }

    public queryItemCount(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryTradingVolume(pricingToken: string): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryFloorPrice(pricingToken: string): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryItems(earlierThen: number, maximum: number, queryFilters: Filter = null): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }
}

export {
    Collection,
}
