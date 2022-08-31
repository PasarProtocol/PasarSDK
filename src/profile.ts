import { AppContext } from "./appcontext"
import { Dispatcher } from "./dispatcher";
import { NftCollection } from "./nftcollection";
import { NftItem } from "./nftitem"

export class Profile {
    private appContext: AppContext;

    private walletAddr: string;
    private userDid: string;

    constructor() {

    };

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
     public fetchCollections(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch collections from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async fetchAndDispatchCollections(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }
}
