import SigninEE from './SigninEE'
import { Initialize, GetNfts } from './library/pasarSDK';
import { useEffect } from 'react';
function App() {

  useEffect(() => {
    console.log(1111111);
    let initialize = new Initialize();
    initialize.init();

    getNFT();
  }, [])

  const getNFT = async () => {
    let getNFT = new GetNfts();
    let result = await getNFT.getNftsOnMarketPlace();
    console.log(result);
  }

  return (
    <div className="App">
      <header className="App-header">
        <SigninEE/>
      </header>
    </div>
  );
}

export default App;
