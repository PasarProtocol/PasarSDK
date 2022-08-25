
import React, {useState} from 'react'
import { signin, signout } from '@pasarprotocol/pasar-sdk-development';

function SigninEE() {

  const [login, setLogin] = useState(false);

  const handleSigninEE1 = async () => {
    let result = await signin();
    setLogin(result);
  }

  const handleSignout = async () => {
    await signout();
    setLogin(false);
  }

  const handleClickMint = async () => {
    
  }

  return (
    !login ?
    <div>
        <button onClick={handleSigninEE1}>Sign in with EE</button>
        {/* <button onClick={handleSigninMM}>Sign in with MM</button> */}
    </div> :
    <div>
        <button onClick={handleSignout}>Sign out</button>

        <div>
          <button onClick={handleClickMint}>Add New NFT</button>
        </div>
        
    </div>

    
  );
}

export default SigninEE;
