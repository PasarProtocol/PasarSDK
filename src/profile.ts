import { AppContext } from "./appcontext"
import { Dispatcher } from "./dispatcher";
import { Collection } from "./collection";
import { NftItem } from "./nftitem"
import { CallContract } from "./callcontract";

export class Profile {
    private appContext: AppContext = new AppContext();
    private callContract: CallContract = new CallContract();
    private walletAddr: string;
    private userDid: string;

    constructor() {

    }

    protected getAppContext(): AppContext {
        return this.appContext
    }

    protected getCallContext(): CallContract {
        return this.callContract
    }

    /**
     * Fetch the listed NFTs owned by this profile.
     * @returns: A list of NFT items.
     */
    public fetchListedItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch listed NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
    public async fetchAndDispatchListedItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    /**
     * Fetch the owned NFTs by this profile.
     * @returns: A list of NFT items.
     */
    public fetchOwnedItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch owned NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async fetchAndDispatchOwnedItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    /**
     * Fetch the bidding NFTs by this profile.
     * @returns: A list of NFT items.
     */
    public fetchBiddingItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch bidding NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async fetchAndDispatchBiddingItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    /**
     * Fetch the created NFTs by this profile.
     * @returns: A list of NFT items.
     */
     public fetchCreatedItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch created NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async fetchAndDispatchCreatedItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    /**
     * Fetch the sold NFTs by this profile.
     * @returns: A list of NFT items.
     */
     public fetchSoldItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch sold NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async fetchAndDispatchSoldItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    /**
     * Fetch all the collection regsitered onto Pasar marketplace
     * @returns: A list of NFT items.
     */
     public fetchCollections(): Promise<Collection[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch collections from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async fetchAndDispatchCollections(dispatcher: Dispatcher<Collection>) {
        // TODO:
    }
}
