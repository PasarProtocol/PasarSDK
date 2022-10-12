import { AppContext } from "./appcontext"
import { CollectionInfo } from "./collection/collectioninfo";
import { NftItem } from "./nftitem"
import { UserInfo } from "./utils";

export class Profile {
    private appContext = AppContext.getAppContext();
    private userInfo: UserInfo;

    private assistService = this.appContext.getAssistService();


    /*constructor(userDid: string, walletAddress: string) {
        this.userDid = userDid;
        this.walletAddress = walletAddress;

    }*/
    constructor() {
    }

    

    /**
     * Query the NFTs owned by this profile.
     * @param walletAddr wallet address
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(walletAddr: string): Promise<NftItem[]> {
        return await this.assistService.getOwnedItems(walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs listed by this profile onto marketplace.
     * @param walletAddr wallet address
     * @returns: A list of NFT items.
     */
    public async queryListedItems(walletAddr: string): Promise<NftItem[]> {
        return await this.assistService.getListedItems(walletAddr).catch((error) => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs made bidding by this profile on market
     * @param walletAddr wallet address
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(walletAddr: string): Promise<NftItem[]> {
        return await this.assistService.getBiddingItems(walletAddr).catch(error => {
            throw new Error(error);
        });
    }

    /**
     * Query the NFTs created by this profile.
     * @param walletAddr wallet address
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(walletAddr: string): Promise<NftItem[]> {
        return await this.assistService.getCreatedItems(walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs sold by this profile
     * @param walletAddr wallet address
     * @returns: A list of NFT items.
     */
     public async querySoldItems(walletAddr: string): Promise<NftItem[]> {
        return await this.assistService.getSoldItems(walletAddr).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Query all the collection regsitered onto Pasar marketplace
     * @param walletAddr wallet address
     * @returns: A list of NFT items.
     */
     public async queryCollections(walletAddr: string): Promise<CollectionInfo[]> {
        return await this.assistService.getOwnedCollections(walletAddr).catch(error => {
            throw new Error(error);
        })
    }
}
