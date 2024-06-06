import { Box, Button, useToast, Stack, Text} from '@chakra-ui/react'
import React, { useState,  useEffect } from 'react'
import { ChatState } from '../../context/ChatProvider.js';
import axios from '../../axios.config.js';
import { IoIosAddCircleOutline } from 'react-icons/io';
import ChatLoader from './ChatLoader.jsx';
import { getSender } from './chatlogic.js';
import GroupChatModal from './GroupChatModal.jsx';


const MyChats = ({fetchAgain}) => {
   const { user, selectedChat, setSelectedChat, chats, setChats} = ChatState();
  const [loggedInUser, setLoggedInUser] = useState();

  const toast = useToast();
  // -- now we have to fetch all the existing chats of the user
  
  const fetchAllChats = async () => {
    try {
         const config = {
         headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
     };
    
    const { data } = await axios.get('/api/chats', config)
    setChats(data);
    
    } catch (error) {
      console.log('CHecking eerrror', error);
       toast({
        title: 'Error fetching the chat',
        description:'Test',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
  
    }
  
  }

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchAllChats();
  }, [fetchAgain])

  
  return (
    <>
      <Box
        display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        bg='white'
        flexDir='column'
        w={{ base: '100%', md: '30%' }}
        borderRadius='lg'
        borderWidth='1px'
        p={3}
        alignItems='center'
      >
        
        <Box
          pb={3}
          px={3}
          fontSize={{ base: '28px', md: '30px' }}
          fontFamily='Work sans'
          display='flex'
          w='100%'
          justifyContent='space-between'
          alignItems='center'
        >
          My chats 
          
          <GroupChatModal>
          <Button
            display='flex'
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<IoIosAddCircleOutline/>}
            
          >
            New Group Chat
          </Button>
        </GroupChatModal>
        
        
        
        </Box>

        <Box
          display='flex'
          flexDir='column'
          p={3}
          bg='#F8F8F8'
          w='100%'
          h='100%'
          borderRadius='lg'
          overflowY='hidden'
        >
          {
            chats ? (
              <Stack overflowY='scroll'>
                {
                  chats.map((chat) => (
                    <Box
                      onClick={() => setSelectedChat(chat)}
                      cursor='pointer'
                      bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                      color={selectedChat === chat ? 'white' : 'black'}
                      px={3}
                      py={2}
                      borderRadius='lg'
                      key={chat._id}
                    >
                      {/* {console.log('CHAT',chat)} */}
                      <Text>
                        {!chat.isGroupChat ? getSender(loggedInUser, chat.users) : chat.chatName}
                      </Text>
      
                    </Box>  
                  ))
                }
              </Stack>
            ) : (<ChatLoader/>)
          }
        </Box>




    </Box>
    
    </>
  )
} 

export default MyChats
