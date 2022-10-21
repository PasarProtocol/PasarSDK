import { AppContext } from "./appcontext"
import { getBiddingItems, getCreatedItems, getListedItems, getOwnedItems, getSoldItems, getOwnedCollections } from "./assistservice";
import { CollectionPage } from "./collection/collectionpage";
import { Filter } from "./filters/filter";
import { ItemPage } from "./itempage";

export class Profile {
    private userDid: string;
    private walletAddr: string;
    private assistUrl: string;

    constructor(userDid: string, walletAddr: string) {
        this.assistUrl = AppContext.getAppContext().getAssistNode();
        this.userDid = userDid;
        this.walletAddr = walletAddr;
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
    ): Promise<ItemPage> {
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
    ): Promise<ItemPage> {
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
    ): Promise<ItemPage> {
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
    ): Promise<ItemPage> {
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
    ): Promise<ItemPage> {
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
    ): Promise<CollectionPage> {
        return await getOwnedCollections(this.assistUrl, this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }
}
