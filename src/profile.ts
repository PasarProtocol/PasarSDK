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
    private callContract: CallContract = new CallContract();
    private callAssistService: CallAssistService = new CallAssistService();
    private essentialsConnector: EssentialsConnector;
    private walletConnectWeb3: Web3;

    constructor() {
        this.essentialsConnector = new EssentialsConnector();
        this.walletConnectWeb3 = new Web3(isInAppBrowser() ? window['elastos'].getWeb3Provider() : this.essentialsConnector.getWalletConnectProvider());
    }

    protected getEssentialConnector(): EssentialsConnector {
        return this.essentialsConnector;
    }

    protected getWeb3Connector(): Web3 {
        return this.walletConnectWeb3;
    }

    protected getWalletAddress(): Promise<string> {
        let accounts = this.walletConnectWeb3.eth.getAccounts();
        return accounts[0];
    }

    protected getGasPrice(): Promise<string> {
        return this.walletConnectWeb3.eth.getGasPrice()
    }

    protected getAppContext(): AppContext {
        return this.appContext
    }

    protected getCallContext(): CallContract {
        return this.callContract
    }

    protected getCallAssistService(): any {
        return this.callAssistService;
    }

    /**
     * Query the listed NFTs owned by this profile.
     * @param walletAddr the wallet address of user
     * @returns: A list of NFT items.
     */
    public async queryListedItems(
        walletAddr:string,
    ): Promise<NftItem[]> {
        let result = await this.callAssistService.getOwnedListedNft(walletAddr);
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
        let result = await this.callAssistService.getOwnedNft(walletAddr);
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
        let result = await this.callAssistService.getBiddingNft(walletAddr);
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
        let result = await this.callAssistService.getCreatedNft(walletAddr);
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
        let result = await this.callAssistService.getSoldNft(walletAddr);
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
        let result = await this.callAssistService.getOwnedCollection(walletAddr);
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
