import { AppContext } from "./appcontext"
import { AssistService } from "./assistservice";
import { CollectionInfo } from "./collection/collectioninfo";
import { EmptyFilter, Filter } from "./filters/filter";
import { NftItem } from "./nftitem"

export class Profile {
    private userDid: string;
    private walletAddr: string;
    private assistService: AssistService;

    constructor(userDid: string, walletAddr: string, appContext: AppContext) {
        this.userDid = userDid;
        this.walletAddr = walletAddr;
        this.assistService = new AssistService(appContext.getAssistNode());
    }

    /**
     * Query the NFTs owned by this profile.
     *
     * @param _filter: A filter condition
     * @returns: A list of NFT items.
     */
     public async queryOwnedItems(_filter = new EmptyFilter()): Promise<NftItem[]> {
        return await this.assistService.getOwnedItems(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs listed by this profile onto marketplace.
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryListedItems(_filter = new EmptyFilter()): Promise<NftItem[]> {
        return await this.assistService.getListedItems(this.walletAddr).catch((error) => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs made bidding by this profile on market
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
    public async queryBiddingItems(_filter = new EmptyFilter()): Promise<NftItem[]> {
        return await this.assistService.getBiddingItems(this.walletAddr).catch(error => {
            throw new Error(error);
        });
    }

    /**
     * Query the NFTs created by this profile.
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryCreatedItems(_filter = new EmptyFilter()): Promise<NftItem[]> {
        return await this.assistService.getCreatedItems(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }

    /**
     * Query the NFTs sold by this profile
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async querySoldItems(_filter = new EmptyFilter()): Promise<NftItem[]> {
        return await this.assistService.getSoldItems(this.walletAddr).catch (error => {
            throw new Error(error);
        })
    }

    /**
     * Query all the collection regsitered onto Pasar marketplace
     * @param _filter: A query filter
     * @returns: A list of NFT items.
     */
     public async queryCollections(_filter = new EmptyFilter()): Promise<CollectionInfo[]> {
        return await this.assistService.getOwnedCollections(this.walletAddr).catch(error => {
            throw new Error(error);
        })
    }
}
