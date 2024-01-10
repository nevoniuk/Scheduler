import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Calender from './Calender';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/Calender" element={<Calender />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
