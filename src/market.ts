import { AppContext } from "./appcontext"
import { EmptyFilter } from "./filters/filter";
import { NftItem } from "./nftitem";
import { NftListInfo } from "./nftlistinfo";

/**
 * This class represents the Pasar marketplace where NFT items are being traded.
 */
class Market {
    private earilerThan: number = Math.floor(Date.now() / 1000);

    /**
     * Get the number of total listed NFT items from remote assist service.
     * @returns The promise object contain the total number of listed NFT items.
     */
    public queryItemCount(_filter = new EmptyFilter()): Promise<number> {
        throw new Error("Method not implemnted");
    }

    /**
     * TODO:
     * @param collectionAddr the collection addresses
     * @param pageNum the page number
     * @param pageSize cell size per page
     */
    public queryItems(earilerThan: number, maximum: number, filter = new EmptyFilter()): Promise<NftItem[]> {
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