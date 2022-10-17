import { AppContext } from "./appcontext"
import { Filter } from "./filters/filter";
import { NftListInfo } from "./nftlistinfo";

/**
 * This class represents the Pasar marketplace where NFT items are being traded.
 */
export class Market {
    private assistUrl: string;

    public constructor(appContext: AppContext) {
        this.assistUrl = appContext.getAssistNode();
    }

    private earilerThan: number = Math.floor(Date.now() / 1000);

    /**
     * Get the number of total listed NFT items from remote assist service.
     * @returns The promise object contain the total number of listed NFT items.
     */
    public queryItemCount(_filter = new Filter()): Promise<number> {
        throw new Error("Method not implemnted");
    }

    /**
     * Query listed items on marketplace.
     * @param earilerThan
     * @param maximum
     * @param filter
     */
    public queryItems(earilerThan: number = Date.now(),
        maximum = 0,
        filter = new Filter()
    ): Promise<NftListInfo[]> {
        throw new Error("Method not implemented");
    /*
    public async queryItems(collectionAddr:string = "", pageNum:number = 1, pageSize:number = 10,): Promise<NftListInfo> {
        if(pageNum == 1) {
            this.earilerThan = Math.floor(Date.now() / 1000);
        }
        return await this.assistService.getAllListedItems(collectionAddr, this.earilerThan, pageNum, pageSize).catch(error => {
            throw new Error(error);
        })
    */
    }
}