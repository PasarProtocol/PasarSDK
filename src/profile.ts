import { AppContext } from "./appcontext"
import { getBiddingItems, getCreatedItems, getListedItems, getOwnedItems, getSoldItems, getOwnedCollections } from "./assistservice";
import { CollectionInfo } from "./collection/collectioninfo";
import { Filter } from "./filters/filter";
import { NftItem } from "./nftitem"

class Quantites{
    private ownedCount: number;
    private listedCount: number;
    private soldCount: number;
    private createdCount: number;
    private biddingCount: number;
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

    public getBidding(): number {
        return this.biddingCount;
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
    private assistUrl: string;

    constructor(userDid: string, walletAddr: string, appContext: AppContext) {
        this.userDid = userDid;
        this.walletAddr = walletAddr;
        this.assistUrl = appContext.getAssistNode();
    }

    public queryQuantites(): Promise<Quantites> {
        throw new Error("Method not implemented");
    }

    /**
     * Query the NFTs owned by this profile.
     *
     * @param _ealierThen
     * @param _capacity
     * @param _filter A filter condition
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<NftItem[]> {
        return await getOwnedItems(this.assistUrl, this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs listed by this profile onto marketplace.
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryListedItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<NftItem[]> {
        return await getListedItems(this.assistUrl, this.walletAddr).catch((error) => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs made bidding by this profile on market
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<NftItem[]> {
        return await getBiddingItems(this.assistUrl, this.walletAddr).catch(error => {
            throw new Error(error);
        });
    }

    /**
     * Query the NFTs created by this profile.
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<NftItem[]> {
        return await getCreatedItems(this.assistUrl, this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs sold by this profile
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async querySoldItems(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<NftItem[]> {
        return await getSoldItems(this.assistUrl, this.walletAddr).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Query all the collection regsitered onto Pasar marketplace
     * @param _ealierThen
     * @param _capacity
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryCollections(
        _ealierThen: number = Date.now(),
        _capacity = 0,
        _filter = new Filter()
    ): Promise<CollectionInfo[]> {
        return await getOwnedCollections(this.assistUrl, this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }
}
