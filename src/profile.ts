import { AppContext } from "./appcontext"
import { Dispatcher } from "./dispatcher";
import { Collection } from "./collection";
import { NftItem } from "./nftitem"

export class Profile {
    private appContext = AppContext.getAppContext();
    private userDid: string;
    private walletAddress: string;


    /*constructor(userDid: string, walletAddress: string) {
        this.userDid = userDid;
        this.walletAddress = walletAddress;

    }*/
    constructor() {
    }

    public getDid(): string {
        return this.userDid;
    }

    public getWalletAddress(): string {
        return this.walletAddress;
    }

    /**
     * Fetch the owned NFTs by this profile.
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(): Promise<NftItem[]> {
        return await this.appContext.getCallAssistService().getOwnedItems(this.walletAddress).catch(error => {
            throw new Error("Failed to get the owned nfts");
        })
    }

    /**
     * Fetch and dispatch owned NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async queryAndDispatchOwnedItems(dispatcher: Dispatcher<NftItem>) {
        return await this.queryOwnedItems().then ( items => {
             items.forEach(item => {
                 dispatcher.dispatch(item)
             })
        }).catch ( error => {
             throw new Error(error)
        })
    }

    /**
     * Query the listed NFTs owned by this profile.
     * @returns: A list of NFT items.
     */
    public async queryListedItems(): Promise<NftItem[]> {
        return await this.appContext.getCallAssistService().getListedItems(this.walletAddress).catch((error) => {
            throw new Error("Failed to get the listed nfts");
        })
    }

    /**
     * Query the listed NFT item from remote assist service and dispatch tem to customized
     * routine to handle.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
    public async queryAndDispatchListedItems(dispatcher: Dispatcher<NftItem>) {
        return await this.queryListedItems().then ( items => {
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
    public async queryBiddingItems(): Promise<NftItem[]> {
        return await this.appContext.getCallAssistService().getBiddingItems(this.walletAddress).catch(error => {
            throw new Error("Failed to get the bidding nfts");
        });
    }

    /**
     * Fetch and dispatch bidding NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async queryAndDispatchBiddingItems(dispatcher: Dispatcher<NftItem>) {
        return await this.queryBiddingItems().then ( items => {
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
     public async queryCreatedItems(): Promise<NftItem[]> {
        return await this.appContext.getCallAssistService().getCreatedItems(this.walletAddress).catch(error => {
            throw new Error("Failed to get the created nfts");
        })
    }

    /**
     * Fetch and dispatch created NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async queryAndDispatchCreatedItems(dispatcher: Dispatcher<NftItem>) {
        return await this.queryCreatedItems().then ( items => {
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
     public async querySoldItems(): Promise<NftItem[]> {
        return await this.appContext.getCallAssistService().getSoldItems(this.walletAddress).catch (error => {
            throw new Error("Failed to get the sold nfts");
        })
    }

    /**
     * Fetch and dispatch sold NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public async queryAndDispatchSoldItems(dispatcher: Dispatcher<NftItem>) {
        return await this.querySoldItems().then ( items => {
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
     public async queryCollections(): Promise<Collection[]> {
        return await this.appContext.getCallAssistService().getOwnedCollections(this.walletAddress).catch(error => {
            throw new Error("Failed to get the created collections");
        })
    }

    /**
     * Fetch and dispatch collections from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT item.
     */
     public async fetchAndDispatchCollections(dispatcher: Dispatcher<Collection>) {
        return await this.queryCollections().then ( collections => {
            collections.forEach(item => {
                dispatcher.dispatch(item)
            })
        }).catch ( error => {
            throw new Error(error)
        })
    }
}
