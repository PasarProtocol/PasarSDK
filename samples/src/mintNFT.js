import { useState } from "react";
import { PasarCollection } from "./library/pasarSDK";

const MintNFT = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');

    const handleMint = async () => {
        console.log(image);
        console.log(name);
        console.log(description);
        let pasarCollection = new PasarCollection();

        let result = await pasarCollection.mintNFT(image, name, description);
        console.log(result);
    }

    const handleChangeImage = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        setImage(reader.result);
    }

    return (
        <div>
            <div>
                <input type="file" onChange={e => handleChangeImage(e)}/>

            </div>
            <div>
                <h3 className="sub_title">Name</h3>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Description</h3>
                <input value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <button onClick={handleMint}>Mint</button>
        </div>
    );
}

export default MintNFT;
