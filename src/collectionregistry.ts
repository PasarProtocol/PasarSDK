import { AppContext } from "./appcontext";
import { Collection } from "./collection";
import { Filter } from "./filters/filter";

class CollectionRegistry {
    private appContext: AppContext;
    private collectionCount: number;

    public getCollectionCount(): number {
        return this.collectionCount;
    }

    public queryCollectionCount(): Promise<number> {
        throw new Error("Method not implemented");
    }

    public queryCollection(earierThan: number, maximum: number, queryFilters: Filter): Promise<Collection[]> {
        throw new Error("Method not implemented");
    }
}

export {
    CollectionRegistry
}
