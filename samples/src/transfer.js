import { useState } from "react";
import { transferNft } from "@pasarprotocol/pasar-sdk-development";

const TransferNFT = () => {
    const [tokenId, setTokenId] = useState("");
    const [toAddress, setToAddress] = useState("");

    const handleTransfer = async () => {
        let result = await transferNft("0x32496388d7c0CDdbF4e12BDc84D39B9E42ee4CB0", tokenId, toAddress);
        console.log(result);
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">to</h3>
                <input value={toAddress} onChange={(e) => setToAddress(e.target.value)}/>
            </div>
            <button className="button" onClick={handleTransfer}>Transfer</button>
        </div>
    );
}

export default TransferNFT;
