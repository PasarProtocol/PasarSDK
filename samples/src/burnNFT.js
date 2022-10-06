import { useState } from "react";
import { deleteNft } from "@pasarprotocol/pasar-sdk-development";

const BurnNFT = () => {
    const [tokenId, setTokenId] = useState("");

    const handleBurn = async () => {
        try {
            await deleteNft("0x32496388d7c0CDdbF4e12BDc84D39B9E42ee4CB0", tokenId, 1);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <button className="button" onClick={handleBurn}>Burn</button>
        </div>
    );
}

export default BurnNFT;
