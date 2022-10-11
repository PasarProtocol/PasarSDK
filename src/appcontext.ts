import Web3 from "web3";
import { AssistService } from "./assistservice";
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';

export class AppContext {
    private appDID: string;

    private assistUrl: string;
    private ipfsUrl: string;
    private didResover: string;

    private assistService: AssistService;
    private web3: Web3;

    static appContext: AppContext;

    private constructor(env: any) {
        this.assistUrl  = env['assistUrl'];
        this.ipfsUrl    = env['ipfsUrl'];
        this.didResover = env['didResover'];
        this.appDID     = env['appDid'];
        this.assistService = new AssistService(this.assistUrl);
    }

    static getAppContext(): AppContext {
        if(!this.appContext) {
            this.appContext = new AppContext(false);
        }
        return this.appContext;
    }

    public getAssistNode(): string {
        return this.assistUrl;
    }

    public getIPFSNode(): string {
        return this.ipfsUrl;
    }

    public getDidResolver(): string {
        return this.didResover
    }

    public getAssistService(): AssistService {
        return this.assistService;
    }

    public isInAppBrowser(): boolean {
        return window['elastos'] !== undefined && window['elastos'].name === 'essentialsiab';
    }

    public getWeb3(): Web3 {
        if(!this.web3) {
            let essentialsConnector = new EssentialsConnector();
            this.web3 = new Web3(this.isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider())
        }
        return this.web3;
    }
}
