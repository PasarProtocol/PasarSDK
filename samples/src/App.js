import SigninEE from './SigninEE'
import { initialize } from '@pasarprotocol/pasar-sdk-development';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    initialize();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <SigninEE/>
      </header>
    </div>
  );
}

export default App;
