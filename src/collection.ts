import { CollectionType } from "./collectiontype";
import { CollectionAddress } from "./contractaddress";
import { Dispatcher } from "./dispatcher";
import { ItemType } from "./itemtype";
import { NftItem } from "./nftitem";

class Condition {}
export class Collection {
    private contractAddr: CollectionAddress;
    private ownerDid: string;
    private ownerAddr: string;

    private socialLinks: { name: string, link: string };
    private avatar: string;
    private name: string;
    private symbol: string;
    private description: string;
    private itemType: ItemType;
    private category: CollectionType;

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

    public queryTradingVolume(
        pricingToken: string): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryFloorPrice(
        pricingToken: string): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryOwnercount(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryItems(earlierThen: number,
        maximum: number,
        queryCondition: Condition,
        dispatcher: Dispatcher<NftItem>): Promise<NftItem[]> {

        throw new Error("Method not implemented");
    }
}