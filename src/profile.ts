import { list } from "postcss";
import { AppContext } from "./appcontext"
import { AssistService } from "./assistservice";
import { CollectionInfo } from "./collection/collectioninfo";
import { EmptyFilter } from "./filters/filter";
import { NftItem } from "./nftitem"

class Quantites{
    private ownedCount: number;
    private listedCount: number;
    private soldCount: number;
    private createdCount: number;
    private collections: number;

    constructor(owned: number, listed: number, sold: number, created: number, collections: number) {
        this.ownedCount = owned;
        this.listedCount = listed;
        this.soldCount = sold;
        this.createdCount = created;
        this.collections = collections;
    }

    public getOwned(): number {
        return this.ownedCount;
    }

    public getListed(): number {
        return this.listedCount;
    }

    public getSold(): number {
        return this.soldCount;
    }

    public getCreated(): number {
        return this.createdCount;
    }

    public getCollections(): number {
        return this.collections;
    }
}

export class Profile {
    private userDid: string;
    private walletAddr: string;
    private assistService: AssistService;

    constructor(userDid: string, walletAddr: string, appContext: AppContext) {
        this.userDid = userDid;
        this.walletAddr = walletAddr;
        this.assistService = new AssistService(appContext.getAssistNode());
    }

    public queryQuantites(): Promise<Quantites> {
        throw new Error("Method not implemented");
    }

    /**
     * Query the NFTs owned by this profile.
     *
     * @param _filter: A filter condition
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(
        _lessThen = 0,
        _capcity = 0,
        _filter = new EmptyFilter()
    ): Promise<NftItem[]> {
        return await this.assistService.getOwnedItems(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs listed by this profile onto marketplace.
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryListedItems(
        _lessThen = 0,
        _capcity = 0,
        _filter = new EmptyFilter()
    ): Promise<NftItem[]> {
        return await this.assistService.getListedItems(this.walletAddr).catch((error) => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs made bidding by this profile on market
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(
        _lessThen = 0,
        _capcity = 0,
        _filter = new EmptyFilter()
    ): Promise<NftItem[]> {
        return await this.assistService.getBiddingItems(this.walletAddr).catch(error => {
            throw new Error(error);
        });
    }

    /**
     * Query the NFTs created by this profile.
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(
        _lessThen = 0,
        _capcity = 0,
        _filter = new EmptyFilter()): Promise<NftItem[]> {
        return await this.assistService.getCreatedItems(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs sold by this profile
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async querySoldItems(
        _lessThen = 0,
        _capcity = 0,
        _filter = new EmptyFilter()
    ): Promise<NftItem[]> {
        return await this.assistService.getSoldItems(this.walletAddr).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Query all the collection regsitered onto Pasar marketplace
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryCollections(_filter = new EmptyFilter()): Promise<CollectionInfo[]> {
        return await this.assistService.getOwnedCollections(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }
}
