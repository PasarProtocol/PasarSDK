import { Category } from "./category";
import { ItemType } from "../itemtype";
import { ChainType } from "../chaintype";

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

export {
    CollectionInfo,
}
