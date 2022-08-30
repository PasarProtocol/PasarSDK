import { AppContext } from "./appcontext"
import { Dispatcher } from "./dispatcher";
import { NftCollection } from "./nftcollection";
import { NftItem } from "./nftitem"

export class Profile {
    private appContext: AppContext;

    private walletAddr: string;
    private userDid: string;

    /**
     *
     * @param dispatcher
     */
    public async fetchAndDispatchListedNFTItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    public async fetchAndDispatchOwnedNFTItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    public async fetchAndDispatchCreatedNFTItems(dispatcher: Dispatcher<NftItem>) {
        // TODO:
    }

    public async fetchAndDispatchOwnedCollections(dispatcher: Dispatcher<NftCollection>) {
        // TODO:
    }
}
