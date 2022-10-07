import { AppContext } from "./appcontext"
import { Dispatcher } from "./dispatcher";
import { Collection } from "./collection";
import { NftItem } from "./nftitem"

export class Profile {
    // private appContext: AppContext = new AppContext();
    
    constructor() {

    }

    protected async getWalletAddress(): Promise<string> {
        let accounts = await AppContext.getAppContext().getWeb3Connector().eth.getAccounts();
        return accounts[0];
    }

    /**
     * Query the listed NFTs owned by this profile.
     * @param walletAddr the wallet address of user
     * @returns: A list of NFT items.
     */
    public async queryListedItems(
        walletAddr:string,
    ): Promise<NftItem[]> {
        let result = await AppContext.getAppContext().getCallAssistService().getOwnedListedNft(walletAddr);
        if(result == null) {
            throw new Error("Failed to get the listed nfts");
        }
        return result;
    }

    /**
     * Query the listed NFT item from remote assist service and dispatch tem to customized
     * routine to handle.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
    public queryAndDispatchListedItems(dispatcher: Dispatcher<NftItem>) {
        // return this.queryListedItems().then ( items => {
        //     items.forEach(item => {
        //         dispatcher.dispatch(item)
        //     })
        // }).catch ( error => {
        //     throw new Error(error)
        // })
    }

    /**
     * Fetch the owned NFTs by this profile.
     * @param walletAddr the wallet address of user
     * @returns: A list of NFT items.
     */
    public async queryOwnedItems(
        walletAddr:string,
    ): Promise<NftItem[]> {
        let result = await AppContext.getAppContext().getCallAssistService().getOwnedNft(walletAddr);
        if(result == null) {
            throw new Error("Failed to get the owned nfts");
        }
        return result;
    }

    /**
     * Fetch and dispatch owned NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchOwnedItems(dispatcher: Dispatcher<NftItem>) {
        // return this.queryOwnedItems().then ( items => {
        //     items.forEach(item => {
        //         dispatcher.dispatch(item)
        //     })
        // }).catch ( error => {
        //     throw new Error(error)
        // })
    }

    /**
     * Fetch the bidding NFTs by this profile.  
     * @param walletAddr the wallet address of user
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(walletAddr:string): Promise<NftItem[]> {
        let result = await AppContext.getAppContext().getCallAssistService().getBiddingNft(walletAddr);
        if(result == null) {
            throw new Error("Failed to get the created nfts");
        }
        return result;
    }

    /**
     * Fetch and dispatch bidding NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchBiddingItems(dispatcher: Dispatcher<NftItem>) {
        // return this.queryBiddingItems().then ( items => {
        //     items.forEach(item => {
        //         dispatcher.dispatch(item)
        //     })
        // }).catch ( error => {
        //     throw new Error(error)
        // })
    }

    /**
     * Fetch the created NFTs by this profile.
     * @param walletAddr the wallet address of user
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(walletAddr: string): Promise<NftItem[]> {
        let result = await AppContext.getAppContext().getCallAssistService().getCreatedNft(walletAddr);
        if(result == null) {
            throw new Error("Failed to get the created nfts");
        }
        return result;
    }

    /**
     * Fetch and dispatch created NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchCreatedItems(dispatcher: Dispatcher<NftItem>) {
        // return this.queryCreatedItems().then ( items => {
        //     items.forEach(item => {
        //         dispatcher.dispatch(item)
        //     })
        // }).catch ( error => {
        //     throw new Error(error)
        // })
    }

    /**
     * Fetch the sold NFTs by this profile.
     * @param walletAddr the wallet address of user
     * @returns: A list of NFT items.
     */
     public async querySoldItems(walletAddr: string): Promise<NftItem[]> {
        let result = await AppContext.getAppContext().getCallAssistService().getSoldNft(walletAddr);
        if(result == null) {
            throw new Error("Failed to get the created nfts");
        }
        return result;
    }

    /**
     * Fetch and dispatch sold NFT items from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT items.
     */
     public queryAndDispatchSoldItems(dispatcher: Dispatcher<NftItem>) {
        // return this.querySoldItems().then ( items => {
        //     items.forEach(item => {
        //         dispatcher.dispatch(item)
        //     })
        // }).catch ( error => {
        //     throw new Error(error)
        // })
    }

    /**
     * Fetch all the collection regsitered onto Pasar marketplace
     * @param walletAddr the address whom be owned the nft
     * @returns: A list of NFT items.
     */
     public async queryCollections(
        walletAddr: string
     ): Promise<Collection[]> {
        let result = await AppContext.getAppContext().getCallAssistService().getOwnedCollection(walletAddr);
        if(result == null) {
            throw new Error("Failed to get the listed nfts");
        }
        return result;
    }

    /**
     * Fetch and dispatch collections from remote assist service to dispatcher routine.
     *
     * @param dispatcher The dispatcher routine to deal with the NFT item.
     */
     public fetchAndDispatchCollections(dispatcher: Dispatcher<Collection>) {
        // return this.queryCollections().then ( collections => {
        //     collections.forEach(item => {
        //         dispatcher.dispatch(item)
        //     })
        // }).catch ( error => {
        //     throw new Error(error)
        // })
    }
}
