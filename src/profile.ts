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
     * Query the listed NFTs owned by this profile.
     * @returns: A list of NFT items.
     */
    public queryListedItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Query the listed NFT item from remote assist service and dispatch tem to customized
     * routine to handle.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
    public queryAndDispatchListedItems(dispatcher: Dispatcher<NftItem>) {
        return this.queryListedItems().then ( items => {
            items.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch ( error => {
            throw new Error(error)
        })
    }

    /**
     * Fetch the owned NFTs by this profile.
     * @returns: A list of NFT items.
     */
    public queryOwnedItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch owned NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchOwnedItems(dispatcher: Dispatcher<NftItem>) {
        return this.queryOwnedItems().then ( items => {
            items.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch ( error => {
            throw new Error(error)
        })
    }

    /**
     * Fetch the bidding NFTs by this profile.
     * @returns: A list of NFT items.
     */
    public queryBiddingItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch bidding NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchBiddingItems(dispatcher: Dispatcher<NftItem>) {
        return this.queryBiddingItems().then ( items => {
            items.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch ( error => {
            throw new Error(error)
        })
    }

    /**
     * Fetch the created NFTs by this profile.
     * @returns: A list of NFT items.
     */
     public queryCreatedItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch created NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchCreatedItems(dispatcher: Dispatcher<NftItem>) {
        return this.queryCreatedItems().then ( items => {
            items.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch ( error => {
            throw new Error(error)
        })
    }

    /**
     * Fetch the sold NFTs by this profile.
     * @returns: A list of NFT items.
     */
     public querySoldItems(): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch sold NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchSoldItems(dispatcher: Dispatcher<NftItem>) {
        return this.querySoldItems().then ( items => {
            items.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch ( error => {
            throw new Error(error)
        })
    }

    /**
     * Fetch all the collection regsitered onto Pasar marketplace
     * @returns: A list of NFT items.
     */
     public queryCollections(): Promise<Collection[]> {
        throw new Error("Method not implemented");
    }

    /**
     * Fetch and dispatch collections from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public fetchAndDispatchCollections(dispatcher: Dispatcher<Collection>) {
        return this.queryCollections().then ( collections => {
            collections.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch ( error => {
            throw new Error(error)
        })
    }
}
