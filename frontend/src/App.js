import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login/Login';
import Menu from './components/Menu/Menu';
import CreateItem from './components/Admin/CreateItem';
import ItemAdmin from './components/Admin/ItemAdmin';
import Navbar from './components/Navbar';
import Routing from './components/Routing/Routing';

function App() {
  // const user = JSON.parse(localStorage.getItem('user'));
  // useEffect(() => {
  //   if(user)
  //   {

  //   }
  // }, [])
  return (
    <div className="App">
      <Navbar />
      {/* <Login />
      <Menu />
      <CreateItem />
      <ItemAdmin /> */}
      <Routing />
    </div>
    
  );
}

export default App;
