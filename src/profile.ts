import { AppContext } from "./appcontext"
import { AssistService } from "./assistservice";
import { CollectionInfo } from "./collection/collectioninfo";
import { NftItem } from "./nftitem"
import { UserInfo } from "./utils";

export class Profile {
    private appContext = AppContext.getAppContext();
    private userInfo: UserInfo;

    private userDid: string;
    private walletAddr: string;
    private assistService: AssistService;

    constructor(userDid: string, walletAddr: string, appContext: AppContext) {
        this.userDid = userDid;
        this.walletAddr = walletAddr;
        this.appContext = appContext;
        this.assistService = new AssistService(appContext.getAssistNode());
    }

    /**
     * Query the NFTs owned by this profile.
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(): Promise<NftItem[]> {
        return await this.assistService.getOwnedItems(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs listed by this profile onto marketplace.
     * @returns: A list of NFT items.
     */
    public async queryListedItems(): Promise<NftItem[]> {
        return await this.assistService.getListedItems(this.walletAddr).catch((error) => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs made bidding by this profile on market
     * @param walletAddr wallet address
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(): Promise<NftItem[]> {
        return await this.assistService.getBiddingItems(this.walletAddr).catch(error => {
            throw new Error(error);
        });
    }

    /**
     * Query the NFTs created by this profile.
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(): Promise<NftItem[]> {
        return await this.assistService.getCreatedItems(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs sold by this profile
     * @returns: A list of NFT items.
     */
     public async querySoldItems(): Promise<NftItem[]> {
        return await this.assistService.getSoldItems(this.walletAddr).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Query all the collection regsitered onto Pasar marketplace
     * @returns: A list of NFT items.
     */
     public async queryCollections(): Promise<CollectionInfo[]> {
        return await this.assistService.getOwnedCollections(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }
}
