import { AppContext } from "./appcontext"
import { EmptyFilter } from "./filters/filter";
import { NftItem } from "./nftitem";

/**
 * This class represents the Pasar marketplace where NFT items are being traded.
 */
class Market {
    private appContext: AppContext;

    /**
     * Get the number of total listed NFT items from remote assist service.
     * @returns The promise object contain the total number of listed NFT items.
     */
    public queryItemCount(_filter = new EmptyFilter()): Promise<number> {
        throw new Error("Method not implemnted");
    }

    /**
     * TODO:
     * @param earilerThan
     * @param maximum
     * @param dispatcher
     */
    public queryItems(earilerThan: number, maximum: number, filter = new EmptyFilter()): Promise<NftItem[]> {
        throw new Error("Method not implemented");
    }
}

export {
    Market
}
