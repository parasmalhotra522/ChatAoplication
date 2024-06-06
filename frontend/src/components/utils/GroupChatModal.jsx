import React, {useState} from 'react'
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
    FormControl,
    Input,
    useToast,
    Skeleton,
    Stack,
    Box
} from '@chakra-ui/react'

import { ChatState } from '../../context/ChatProvider';
import axios from '../../axios.config.js';
import UserListItem from '../UserListItem';
import UserBadgeItem from './UserBadgeItem';


const GroupChatModal = ({children}) => {

    const toast = useToast();
    const { user, chats, setChats} = ChatState();
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupChatName, setGroupChatName] = useState();
    // Method to create a Group Chat
    const handleSubmit = async() => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all the fields',
                status: 'Warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            }); 
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post(`/api/chats/createGroup`,
                {
                    chatName: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u)=>u._id))
                },
                config
            
            )
           
            
            setChats([data, ...chats]);
            onClose();
             toast({
                title: 'New Group Chat Created Successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top' 
            }); 
        } catch (error) {
            toast({
                title: 'Failed to Create the Group Chat!',
                description: error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            }); 
        }
    }
    
    const handleAddingUsersToGroup = (userToAdd) => { 
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added',
                status: 'Warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);

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
            toast({
                title: 'Success',
                description: 'Users data retreived successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });
       
       
       
        } catch (error) {
            toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
      setLoading(false);
        }



    }

    const handleRemovalOfUser = (u) => {
        console.log("i am removing user", u);
        setSelectedUsers(selectedUsers.filter((user) => user._id !== u._id));   
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    
    return (
        <>
        
          <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <FormControl>
            
                            <Input type='text' placeholder='Enter Group Chat Name'
                                onChange={(e)=>setGroupChatName(e.target.value)}
                                mb={3}
                          />
                          
                          <Input type='text' placeholder='Add Users eg: Sarah, John, Jenny'
                              onChange={(e) => { handleSearch(e.target.value) }}
                          
                          />
            </FormControl>  

                      <Box w='100%' d='flex' flexWrap='wrap'>
                          {selectedUsers.map((u) => (
                              <UserBadgeItem
                                  key={u._id}
                                  user={u}
                                  handleFunction = {() => handleRemovalOfUser(u)} 
                              />
                                  
                            
                         ))}
                      </Box>
                      


                      {loading ? (
                        <Stack>
                            <Skeleton height='20px' />
                            <Skeleton height='20px' />
                            <Skeleton height='20px' />
                        </Stack>    


                      ) : (
                          searchResult?.slice(0, 4).map((user) => (
                              <UserListItem key={user._id} user={user}
                              handleFunction={()=> handleAddingUsersToGroup(user)}
                              />
                          ))
            )}


            </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
  
}

export default GroupChatModal
