import { AppContext } from "./appcontext";
import { Dispatcher } from "./dispatcher";
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

    public queryCollection(earierThan: number, maximum: number, queryFilters: Filter,
        disaptcher: Dispatcher<Collection>) {
        throw new Error("Method not implemented");
    }
}

export {
    CollectionRegistry
}
