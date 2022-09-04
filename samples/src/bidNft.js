import { useState, useEffect } from "react";
import { getCoinType, bidItemOnAuction} from "@pasarprotocol/pasar-sdk-development";

const BidNFT = () => {
    const [orderId, setOrderId] = useState("");
    const [price, setPrice] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleList = async () => {
        let result;
        result = await bidItemOnAuction(orderId, price, setProgress);
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
            <div>
                <h3 className="Price">Price</h3>
                <input value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <button className="button" onClick={handleList}>Bid</button>
        </div>
    );
}

export default BidNFT;
