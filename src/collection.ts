import { Category } from "./category";
import { Filter } from "./filters/filter";
import { ItemType } from "./itemtype";
import { NftItem } from "./nftitem";
import { ChainType } from "./chaintype";

class CollectionInfo {
    constractAddr: string;
    network: ChainType;
    createdDid: string;
    createdAddr: string;
    name: string;
    symbol: string;

    socialLinks: string[];
    avatar: string;
    description: string;
    ercType: ItemType;
    category: Category;

    constructor(contractAddr: string, network: ChainType, creatorDid: string, creatorAddr: string, name: string, symbol: string) {
        this.constractAddr = contractAddr;
        this.network = network;
        this.createdDid = creatorDid;
        this.createdAddr = creatorAddr;
        this.name = name;
        this.symbol = symbol;
    }

    public appendSoicalLink(link: string): CollectionInfo {
        this.socialLinks.push(link);
        return this;
    }

    public setSocialLinks(links: string[]): CollectionInfo {
        this.socialLinks = links;
        return this;
    }

    public setAvatar(avatar: string): CollectionInfo {
        this.avatar = avatar;
        return this;
    }

    public setDescription(description: string): CollectionInfo {
        this.description = description;
        return this;
    }

    public setErcType(ercType: ItemType): CollectionInfo {
        this.ercType = ercType;
        return this;
    }

    public setCategory(category: Category): CollectionInfo {
        this.category = category;
        return this;
    }
}

class Collection {
    private info: CollectionInfo;

    constructor(collecionInfo: CollectionInfo) {
        this.info = collecionInfo;
    }

    public getContractAddress(): string {
        return this.info.constractAddr;
    }

    public getNetwork(): string {
        return this.info.network;
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
    CollectionInfo,
}
