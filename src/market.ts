import { AppContext } from "./appcontext"
import { Filter } from "./filters/filter";
import { NftItem } from "./nftitem";

/**
 * This class represents the Pasar marketplace where NFT items are being traded.
 */
class Market {
    private appContext: AppContext;
    private numberOfItems: number;

    /**
     * Get the number of total listed NFT item on local storage
     * @returns The number of listed NFT item
     */
    public getItemCount(): number {
        return this.numberOfItems;
    }

    /**
     * Get the number of total listed NFT items from remote assist service.
     * @returns The promise object contain the total number of listed NFT items.
     */
    public queryItemCount(): Promise<number> {
        throw new Error("Method not implemnted");
    }

    /**
     * TODO:
     * @param earilerThan
     * @param maximum
     * @param dispatcher
     */
    public queryItems(earilerThan: number, maximum: number, filters: Filter): Promise<NftItem[]> {

        throw new Error("Method not implemented");
    }
}

export {
    Market
}
