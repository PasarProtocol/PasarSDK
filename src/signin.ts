import { DID, connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { VerifiablePresentation, DefaultDIDAdapter, DIDBackend } from '@elastosfoundation/did-js-sdk';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { DidResolverUrl, valuesOnTestNet, valuesOnMainNet } from './constant';
import { utils } from './utils'; 

const essentialsConnector = new EssentialsConnector();
const isInAppBrowser = () => window['elastos'] !== undefined && window['elastos'].name === 'essentialsiab';
let connectivityInitialized = false;

const isUsingEssentialsConnector = () => {
    const activeConnector = connectivity.getActiveConnector();
    return activeConnector && activeConnector.name === essentialsConnector.name;
}

const initConnectivitySDK = async () => {
    if (connectivityInitialized) return;
  
    console.log('Preparing the Elastos connectivity SDK');
  
    // unregistear if already registerd
    const arrIConnectors = connectivity.getAvailableConnectors();
    if (arrIConnectors.findIndex((option) => option.name === essentialsConnector.name) !== -1) {
        await connectivity.unregisterConnector(essentialsConnector.name);
        console.log('unregister connector succeed.');
    }
  
    await connectivity.registerConnector(essentialsConnector).then(async () => {
        connectivity.setApplicationDID(utils.testNet ? valuesOnTestNet.didApplication : valuesOnMainNet.didApplication);
        connectivityInitialized = true;

        console.log('essentialsConnector', essentialsConnector);
        console.log('Wallet connect provider', essentialsConnector.getWalletConnectProvider());

        const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();
        console.log('Has link to essentials?', hasLink);

        // Restore the wallet connect session - TODO: should be done by the connector itself?
        if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
            await essentialsConnector.getWalletConnectProvider().enable();
    });
}

const signOutWithEssentials = async () => {
    sessionStorage.removeItem('USER_DID');

    try {
        if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
            await essentialsConnector.disconnectWalletConnect();
        if (isInAppBrowser() && (await window['elastos'].getWeb3Provider().isConnected()))
            await window['elastos'].getWeb3Provider().disconnect();
    } catch (error) {
        console.log('Error while disconnecting the wallet', error);
    }
};

const signInWithEssentials = async () => {
    await initConnectivitySDK();
    const didAccess = new DID.DIDAccess();
    // let presentation;
    try {
      const presentation = await didAccess.requestCredentials({
        claims: [DID.simpleIdClaim('Your avatar', 'avatar', false), DID.simpleIdClaim('Your name', 'name', false), DID.simpleIdClaim('Your description', 'description', false)]
      });
      if (presentation) {
        const did = presentation.getHolder().getMethodSpecificId() || '';

        DIDBackend.initialize(new DefaultDIDAdapter(DidResolverUrl));
        // verify
        const vp = VerifiablePresentation.parse(JSON.stringify(presentation.toJSON()));
        
        const sDid = vp.getHolder().toString();
        if (!sDid) {
          console.log('Unable to extract owner DID from the presentation');
          return;
        }
        // Optional name
        const nameCredential = vp.getCredential(`name`);
        const name = nameCredential ? nameCredential.getSubject().getProperty('name') : '';
        // Optional bio
        const bioCredential = vp.getCredential(`description`);
        const bio = bioCredential ? bioCredential.getSubject().getProperty('description') : '';

        let user = {
            name: name,
            bio: bio,
            did: sDid
        }

        sessionStorage.setItem("USER_DID", JSON.stringify(user));
        let essentialAddress = essentialsConnector.getWalletConnectProvider().wc.accounts[0]
        if (isInAppBrowser())
          essentialAddress = await window['elastos'].getWeb3Provider().address
        // setWalletAddress(essentialAddress);
        // setActivatingConnector(essentialsConnector);
      }
    } catch (e) {
      try {
        await essentialsConnector.getWalletConnectProvider().disconnect();
      } catch (e) {
        console.log('Error while trying to disconnect wallet connect session', e);
      }
    }
};

const signin = async () => {
    if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
      await signOutWithEssentials();
    } else if (essentialsConnector.hasWalletConnectSession()) {
      await essentialsConnector.disconnectWalletConnect();
    }
    await signInWithEssentials();
}

export {
    signin
}