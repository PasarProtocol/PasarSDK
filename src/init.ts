/**
 * This class initialize the values on sdk
 */

import { utils } from "./utils";

export class Initialize {

    /**
     * initialize the values on sdk.
     *
     * @param testnet set the testNet. If true is testNet, else mainNet. default value is true
     */
	public init(testnet: boolean = true): void {
		utils.testNet = testnet;
	}
}