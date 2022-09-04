import { useState, useEffect } from "react";
import { getCoinType, buyItem} from "@pasarprotocol/pasar-sdk-development";

const BuyNFT = () => {
    const [orderId, setOrderId] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleBuy = async () => {
        let result;
        result = await buyItem(orderId, setProgress);
        console.log(result);
    }

    const handleClickHome = () => {
        navigate('/')
    }

    return (
        <div>
            <button className="button" onClick={handleClickHome}>Go to first page</button>
            <div>
                <h3 className="sub_title">OrderId</h3>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)}/>
            </div>
            <button className="button" onClick={handleBuy}>Buy</button>
        </div>
    );
}

export default BuyNFT;
