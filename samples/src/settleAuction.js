import { useState, useEffect } from "react";
import { getCoinType, settleAuction} from "@pasarprotocol/pasar-sdk-development";
import { useNavigate } from "react-router-dom";

const SettleAuction = () => {
    const navigate = useNavigate();
    const [tokenId, setTokenId] = useState("");
    const [baseToken, setBaseToken] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleSettle = async () => {
        let result;
        result = await settleAuction(tokenId, setProgress);
        console.log(result);
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
            <button className="button" onClick={handleSettle}>Settle</button>
        </div>
    );
}

export default SettleAuction;
