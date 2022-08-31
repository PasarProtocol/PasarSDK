import { AppContext } from "./appcontext";
import { Dispatcher } from "./dispatcher";
import { Collection } from "./collection";

class Condition {}

export class CollectionSpace {
    private appContext: AppContext;
    private numberOfCollections: number;

    public getNumberOfCollection(): number {
        return this.numberOfCollections;
    }

    public fetchNumberOfCollections(
        dispatcher: Dispatcher<number>): Promise<number> {

        throw new Error("Method not implemented");
    }

    public fetchCollections(earierThan: number,
        maximum: number,
        condition: Condition,
        disaptcher: Dispatcher<Collection>) {

        throw new Error("Method not implemented");
    }
}