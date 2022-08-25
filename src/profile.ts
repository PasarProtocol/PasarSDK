
class NFTItem {};
class NFTCollection {]}
interface Dispatcher<T> {
    dispatch(t: T);
}

export class Profile {
    public async fetchAndDispatchListedNFTItems(dispatcher: Dispatcher<NFTItem>) {
        throw new Error("TODO");
    }

    public async fetchAndDispatchOwnedNFTItems(dispatcher: Dispatcher<NFTItem>) {
        throw new Error("TODO");
    }

    public async fetchAndDispatchBidNFTItems(dispatcher: Dispatcher<NFTItem>) {
        throw new Error("TODO");
    }

    public async fetchAndDispatchCreatedNFTItems(dispatcher: Dispatcher<NFTItem>) {
        throw new Error("TODO");
    }

    public async fetchAndDispatchSoldNFTItems(dispatcher: Dispatcher<NFTItem>) {
        throw new Error("TODO");
    }

    public async fetchAndDispatchOwnedCollections(dispatcher: Dispatcher<NFTCollection>) {
        throw new Error("TODO");
    }
}