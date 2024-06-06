import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideNavBar from '../components/utils/sideNavBar';
import ChatBox from '../components/utils/ChatBox.jsx';
import MyChats from '../components/utils/MyChats.jsx';


export default function ChatPage() {

  // we are using context so we could have used useContext, since we already did it
  // and just exported the State, as user
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  // console.log('I am checking the context', user);
    return (
      <div style={{ width: "100%" }}>
      
      {/* {console.log('CHECKING IF USER...', user)} */}
        { user && <SideNavBar/>}
        
        <Box display='flex'
          justifyContent='space-between'
          w='100%'
          h='91.5vh'
          p='10px'  
        >
        {/* <h1 style={{ 'color':'white' }}>HELLO CHAT</h1> */}
           { user && <MyChats fetchAgain={fetchAgain}/> }
          {user && <ChatBox fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain} /> } 
        </Box>
      </div>
  )
}
