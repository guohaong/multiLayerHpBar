import logo from './logo.svg';
import './App.css';
import Wheel from './Wheel';
import Map0 from './submarine/Map0';
import TestHpBar from './TestHpBar';
// npm start

function App() {
  return (
    <div className="App">
      {/* <Wheel></Wheel> */}
      <TestHpBar maxHp={500} />

      {/* <Map0></Map0> */}
 
    </div>
  );
}

export default App;
