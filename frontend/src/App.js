import logo from './logo.svg';
// import './App.css';
import Login from './components/Login/Login';
import Menu from './components/Menu/Menu';
import CreateItem from './components/Admin/CreateItem';
import ItemAdmin from './components/Admin/ItemAdmin';

function App() {
  return (
    <div className="App">
      <Login />
      <Menu />
      <CreateItem />
      <ItemAdmin />
    </div>
  );
}

export default App;
