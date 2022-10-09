import { CollectionCategory } from "./collectioncategory";
import { Filter } from "./filters/filter";
import { CollectionAddress } from "./contractaddress";
import { ItemType } from "./itemtype";
import { NftItem } from "./nftitem";

class Collection {
    private contractAddr: CollectionAddress;
    private ownerDid: string;
    private ownerAddr: string;

    private socialLinks: any;
    private avatar: string;
    private name: string;
    private symbol: string;
    private description: string;
    private itemType: ItemType;
    private category: CollectionCategory;

    constructor(contractAddress: CollectionAddress, ownerDid: string, ownerAddr: string, avatar: string, name: string, description: string, symbol: string, itemType: ItemType, category: CollectionCategory, socialLink: any) {
        this.contractAddr = contractAddress;
        this.ownerDid = ownerDid;
        this.ownerAddr = ownerAddr;
        this.avatar = avatar;
        this.name = name;
        this.symbol = symbol;
        this.description = description;
        this.itemType = itemType;
        this.category = category;
        this.socialLinks = socialLink;
    }

    public getContractAddress(): CollectionAddress {
        return this.contractAddr;
    }

    public getOwnerDid(): string {
        return this.ownerDid;
    }

    public getOwnerAddress(): string {
        return this.ownerAddr;
    }

    public getAvatar(): string {
        return this.avatar;
    }

    public getName(): string {
        return this.name;
    }

    public getSymbol(): string {
        return this.symbol;
    }

    public getDescritpion(): string {
        return this.description;
    }

    public getERCStandard(): string {
        return this.itemType.toString();
    }

    public getCategory(): string {
        return this.category.toString();
    }

    public getSocialLinks(): any {
        return this.socialLinks;
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

    public queryOwnercount(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryItems(earlierThen: number, maximum: number, queryFilters: Filter): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }
}

export {
    Collection,
}
