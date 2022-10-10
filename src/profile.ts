import { AppContext } from "./appcontext"
import { Collection, CollectionInfo } from "./collection";
import { NftItem } from "./nftitem"
import { UserInfo } from "./utils";

export class Profile {
    private appContext = AppContext.getAppContext();
    private userDid: string;
    private walletAddress: string;
    private userInfo: UserInfo;

    private assistService = this.appContext.getAssistService();


    /*constructor(userDid: string, walletAddress: string) {
        this.userDid = userDid;
        this.walletAddress = walletAddress;

    }*/
    constructor() {
    }

    public setUserInfo = (info: UserInfo) => {
        this.userInfo = info;
    }

    public getUserInfo = ():UserInfo => {
        return this.userInfo;
    }

    public deleteUserInfo = () => {
        this.userInfo.name = null;
        this.userInfo.bio = null;
        this.userInfo.did = null;
        this.userInfo.address = null;
    }

    public getDid(): string {
        return this.userDid;
    }

    public getWalletAddress(): string {
        return this.walletAddress;
    }

    /**
     * Query the NFTs owned by this profile.
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(): Promise<NftItem[]> {
        return await this.assistService.getOwnedItems(this.walletAddress).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs listed by this profile onto marketplace.
     * @returns: A list of NFT items.
     */
    public async queryListedItems(): Promise<NftItem[]> {
        return await this.assistService.getListedItems(this.walletAddress).catch((error) => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs made bidding by this profile on market
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(): Promise<NftItem[]> {
        return await this.assistService.getBiddingItems(this.walletAddress).catch(error => {
            throw new Error(error);
        });
    }

    /**
     * Query the NFTs created by this profile.
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(): Promise<NftItem[]> {
        return await this.assistService.getCreatedItems(this.walletAddress).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs sold by this profile
     * @returns: A list of NFT items.
     */
     public async querySoldItems(): Promise<NftItem[]> {
        return await this.assistService.getSoldItems(this.walletAddress).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Query all the collection regsitered onto Pasar marketplace
     * @returns: A list of NFT items.
     */
     public async queryCollections(): Promise<CollectionInfo[]> {
        return await this.assistService.getOwnedCollections(this.walletAddress).catch(error => {
            throw new Error(error);
        })
    }
}
