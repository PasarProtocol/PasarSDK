import { AppContext } from "./appcontext"
import { Dispatcher } from "./dispatcher";
import { Collection } from "./collection";
import { NftItem } from "./nftitem"
import { CallContract } from "./callcontract";
import { CallAssistService } from "./callassistservice";
import { isInAppBrowser} from "./global";
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import Web3 from "web3";

export class Profile {
    private appContext: AppContext = new AppContext();
    
    private essentialsConnector: EssentialsConnector = new EssentialsConnector();
    private walletConnectWeb3: Web3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : this.essentialsConnector.getWalletConnectProvider());

    constructor() {

    }

    protected getEssentialConnector(): EssentialsConnector {
        return this.essentialsConnector;
    }

    protected getWeb3Connector(): Web3 {
        return this.walletConnectWeb3;
    }

    protected getChainId():number {
        return this.essentialsConnector.getWalletConnectProvider().wc.chainId;
    }

    protected async getWalletAddress(): Promise<string> {
        let accounts = await this.walletConnectWeb3.eth.getAccounts();
        return accounts[0];
    }

    protected async getGasPrice(): Promise<string> {
        return await this.walletConnectWeb3.eth.getGasPrice()
    }

    protected getAppContext(): AppContext {
        return this.appContext
    }

    protected getCallContext(): CallContract {
        return this.appContext.getCallContract();
    }

    protected getCallAssistService(): any {
        return this.appContext.getCallAssistService();
    }

    /**
     * Query the listed NFTs owned by this profile.
     * @param walletAddr the wallet address of user
     * @returns: A list of NFT items.
     */
    public async queryListedItems(
        walletAddr:string,
    ): Promise<NftItem[]> {
        let result = await this.appContext.getCallAssistService().getOwnedListedNft(walletAddr);
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
        let result = await this.appContext.getCallAssistService().getOwnedNft(walletAddr);
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
        let result = await this.appContext.getCallAssistService().getBiddingNft(walletAddr);
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
        let result = await this.appContext.getCallAssistService().getCreatedNft(walletAddr);
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
        let result = await this.appContext.getCallAssistService().getSoldNft(walletAddr);
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
        let result = await this.appContext.getCallAssistService().getOwnedCollection(walletAddr);
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
