import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Box,
    FormControl,
    Input,
    useToast,
    Spinner
} from '@chakra-ui/react'

import { FaEye } from "react-icons/fa";
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from '../UserListItem';
import axios from '../../axios.config.js';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const [groupChatName, setGroupChatName] = useState()
    const [renameLoading, setRenameLoading] = useState()
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);
   

    const toast = useToast();

  
    
    const handleRename = async () => { 
        console.log("Trying to rename the group", groupChatName);
        if (!groupChatName) return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put(`/api/chats/renameGroup`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName
                },
                config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
    
        } catch (error) {
             toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });
            setRenameLoading(false);
        }
        setGroupChatName('');



    }

    const handleAddingUsersToGroup = async (newUser) => {

        if (selectedChat.users.find((u) => u._id === newUser._id)) {
            toast({
                title: 'User already in the Group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        // if (selectedChat.groupAdmin._id !== newUser._id) {
        //     toast({
        //         title: 'Only Admins can add a User to the Group',
        //         status: 'error',
        //         duration: 5000,
        //         isClosable: true,
        //         position: 'top'
        //     });
        //     return;
        // }

        try {
            console.log('---------Trying to add new user---');
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
             const { data } = await axios.put(`/api/chats/addToGroup`,
                {
                    chatId: selectedChat._id,
                    userId: newUser._id
                },
                config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            
        } catch (error) {
             toast({
                title: 'Error Occured!!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
             });
            setLoading(false);
        }
    }
   
    const handleSearch = async(searchValue) => {
       
        if (!searchValue) {
        toast({
            title: `Search User can't be left empty`,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top-left'
        });
        }

        try {
            const config = {
            headers: {
            Authorization: `Bearer ${user.token}`
                    }
            };
            const {data} = await axios.get(`/api/user?search=${searchValue}`, config)
            console.log('checking the response--- inside modal', data);
            setLoading(false);
            setSearchResult(data);
           
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });
            setLoading(false);
        }



    }
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id
            &&
            user1._id !==user._id
        ) {
            toast({
                title: 'Only admins can remove someone',    
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            }); 
            return;
        } 
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
             const { data } = await axios.put(`/api/chats/removeMemberFromGroup`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                },
                 config);
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured!',  
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            }); 
            setLoading(false);
        }




       }

    const removeUserFromGroup = async (user1) => {
        console.log('I am trying to remove User from the group', user1)
        // removeMemberFromGroup
       
        if (user1._id === user._id) {
            toast({
                title: 'Admin can leave the Group but not remove themselves',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });
            return;
       }
       
       
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
             const { data } = await axios.put(`/api/chats/removeMemberFromGroup`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                },
                config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
              toast({
                title: 'Error Occured!!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
             });
            setLoading(false);
        }

    }




    
    return (
      <>
       <FaEye d={{ base:'flex'}} onClick={onOpen}/>
          <Modal
              size='lg'
              isCentered
              isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
                    <ModalHeader
                        display='flex'
                         fontFamily='Work sans'
                        justifyContent='center'
                    
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                   
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                        
                    >
                        <Box display='flex' flexWrap='wrap' w='100%'>
                            {
                                selectedChat.users.map((user) => (
                                    <UserBadgeItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={()=>removeUserFromGroup(user)}
                                    
                                    />
                                ))
                                }
                            </Box>
                      
                        <FormControl display='flex'>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                mr={1}
                                value={groupChatName}
                                onChange={(e)=>setGroupChatName(e.target.value)}
                            />
                            <Button variant='solid'
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>    
                        </FormControl>

                        <FormControl>
                            <Input type='text' placeholder='Add Users to the Group'
                              onChange={(e) => { handleSearch(e.target.value) }}
                          
                          />
                        </FormControl>
                        {loading ? (
                                   <Spinner size='lg'/>   
                                    ) : (
                          searchResult?.slice(0, 4).map((user) => (
                              <UserListItem key={user._id} user={user}
                              handleFunction={()=> handleAddingUsersToGroup(user)}
                              />
                          )))
                                    }



                    </ModalBody>

          <ModalFooter>
                        <Button colorScheme='red'
                            mr={3}
                            onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

          


      </>
  )
}

export default UpdateGroupChatModal
