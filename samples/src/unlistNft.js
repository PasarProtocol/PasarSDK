import { useState, useEffect } from "react";
import { MyProfile } from "@pasarprotocol/pasar-sdk-development";
import { useNavigate } from "react-router-dom";

const UnlistNFT = () => {
    const navigate = useNavigate();
    const [tokenId, setTokenId] = useState("");
    const [baseToken, setBaseToken] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleSettle = async () => {
        try {        
            // await unlistItem(tokenId, baseToken, setProgress);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3 className="sub_title">TokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Collection Address</h3>
                <input value={baseToken} onChange={(e) => setBaseToken(e.target.value)}/>
            </div>
            <button className="button" onClick={handleSettle}>Unlist NFT</button>
        </div>
    );
}

export default UnlistNFT;
