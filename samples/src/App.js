import SigninEE from './SigninEE'
import { AppContext } from '@pasarprotocol/pasar-sdk-development';

function App() {
  AppContext.createInstance(true)

  return (
    <div className="App">
      <header className="App-header">
        <SigninEE/>
      </header>
    </div>
  );
}

export default App;
