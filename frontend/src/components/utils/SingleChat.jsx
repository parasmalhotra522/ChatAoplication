import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { Box, Spinner, Text, FormControl, Input, useToast } from '@chakra-ui/react';
import { FaArrowLeft } from "react-icons/fa";
import { getSender, getSenderObjects } from './chatlogic.js';
import ProfileModal from './MyProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import './styles.css';
import Chat from './Chat.jsx';
import io from 'socket.io-client';
import Lottie from 'lottie-react';
import typingAnimation from '../TypingAnimation.json';
import axios from '../../axios.config.js';

// const END_POINT = 'http://localhost:8081';
const END_POINT = 'https://lets2alk.onrender.com';

var socket, selectedCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
  
    const { user, selectedChat, setSelectedChat, notifications, setNotifications} = ChatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [socketConnected, setSocketConnected, ] = useState(false);
    
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData:typingAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        }
    }
    const fetchMessages = async (e) => {
        if (!selectedChat) {
            return;
        }    
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`,config);
            // console.log("Checking the response of fetchig the messages", data);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
            



            } catch (error) {
            toast({
                    title: 'Error Occured !',
                    description: 'Failed to load the messages',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-left'
                });   
            }
    }

    const sendMessage = async(e) => {

        // -- we now know that someone has clicked enter and we should send the message 
        // --- only when something is already typed in the new Message input area
        if (e.key === "Enter" && newMessage) {
            setNewMessage("");
            socket.emit('stop typing', selectedChat._id);
            const config = {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
                }
            };
            try {
                const { data } = await axios.post('/api/message',
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config);
                    socket.emit('new message', data);
                setMessages([...messages, data]);
                
            } catch (error) {
                toast({
                    title: 'Error sending the message',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-left'
                });   
            }
                    
            
        }
            
    } 

   
    

    useEffect(() => {
        fetchMessages();
        selectedCompare = selectedChat;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat, setSelectedChat]);
    // console.log("-- selected chat", selectedChat);

    useEffect(() => {
        setSelectedChat('')
        socket = io(END_POINT);
        console.log('Checking the client-side', socket);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
         socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            
            if (!selectedCompare || selectedCompare._id !== newMessageReceived.chat._id) {
                // give notificationss
                if (!notifications.includes(newMessageReceived)) {
                    setNotifications([newMessageReceived, ...notifications]);
                    setFetchAgain(!fetchAgain);
                }   
                console.log('----notifications', notifications);
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    })

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDifference = timeNow - lastTypingTime;
            if (timeDifference >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    }

    return (
       <>
            {selectedChat ? 
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        w='100%'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent={{ base: 'space-between' }}
                        alignItems='center'
                    >
                        <FaArrowLeft
                            display={{ base:'flex', md:'none'}}
                            onClick={()=>setSelectedChat('')}
                        />
                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    {console.log('*********CHECL USER', user, selectedChat )}
                                    {console.log("*****",getSender(user, selectedChat.users))}
                                    {getSender(user, selectedChat.users)}
                                    
                                    <ProfileModal user={ getSenderObjects(user, selectedChat.users)} />
                                </>
                            ) : (
                                    <>
                                    {/* It is a Group chat  */}
                                    {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain} 
                                            fetchMessages = {fetchMessages}
                                        />
                                    </>
                                    
                            )
                        }


                    </Text>

                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        bg='#E8E8E8'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        
                        {
                            loading ? (<Spinner
                                size='xl'
                                alignSelf='center'
                                margin='auto'
                                w={20}
                                h={20}
                            />) : <div className='messages'>
                                    <Chat messages={messages} />
                                    
                                </div>
                        }
                        
                        <FormControl onKeyDown={sendMessage}>
                        {
                                isTyping ? (
                                    <Lottie animationData={typingAnimation}
                                        options={defaultOptions}
                                        style={{
                                            marginBottom: 15,
                                            marginLeft: 0,
                                            width:'48px'
                                        }}
                                    
                                    ></Lottie>
                                )
                                    : (<></>)
                        }
                            <Input
                                variant='filled'
                                bg='#E0E0E0'
                                placeholder='Enter a message'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                            
                    </FormControl>
                    
                    </Box>




                </>
                
                
                
                :
               <Box display='flex' alignItems='center'
                   justifyContent='center' h='100%'>
                   <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
                       
                       Select a chat to display
                   </Text>
               </Box>
               
           }
       </>
  )
}

export default SingleChat
