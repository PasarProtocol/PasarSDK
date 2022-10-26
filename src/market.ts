import { AppContext } from "./appcontext"
import { getAllListedItems } from "./assistservice";
import { Filter } from "./filters/filter";
import { ItemPage } from "./itempage";

/**
 * This class represents the Pasar marketplace where NFT items are being traded.
 */
export class Market {
    private assistUrl: string;

    public constructor(appContext: AppContext) {
        this.assistUrl = appContext.getAssistNode();
    }

    /**
     * Get the number of total listed NFT items from remote assist service.
     * @returns The promise object contain the total number of listed NFT items.
     */
    public queryItemCount(_filter = new Filter()): Promise<number> {
        throw new Error("Method not implemnted");
    }

    /**
     * Query listed items on marketplace.
     */
    public async queryItems(beforeTime: number, pageNum = 1, pageSize = 10,): Promise<ItemPage> {
        try {
            return await getAllListedItems(this.assistUrl, beforeTime, "", pageNum, pageSize)
        } catch (error) {
            throw new Error(`Query Items from marketplace error ${error}`)
        }
    }

    public queryItemsOfficial(beforeTime: number, capacity: number, filter = new Filter()) {
        throw new Error("TODO: method not implemented")
    }

    public queryLatestItem(filter = new Filter()) {
        throw new Error("TODO: method not implmented");
    }

    public queryPopularItem(filter = new Filter()) {
        throw new Error("TODO: method not implemented");
    }
}
