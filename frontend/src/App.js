import './App.css';
// import { Button } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';


function App() {
  return (

    <div className="App">
    
      <Routes>
        <Route path='/' element={<HomePage/>} exact/>
         <Route path='/chats' element={<ChatPage/>} exact/>
        </Routes>

      {/* <Button colorScheme='blue'>Button</Button> */}
    </div>
  );
}

export default App;
