import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
    const { selectedChat} = ChatState();
 
  return (
    <>
      <Box
       display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
        bg='white'
        flexDir='column'
        w={{ base: '100%', md: '69%' }}
        borderRadius='lg'
        borderWidth='1px'
        p={3}
        alignItems='center'
      >

        <SingleChat fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain} >
        </SingleChat>



      </Box>
    
    </>
  )
}

export default ChatBox
