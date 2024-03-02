import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './component/Home';
import "./App.css";
import AddCandidate from './component/Admin/AddCandidate/AddCandidate';
function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/AddCandidate' element={<AddCandidate/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
