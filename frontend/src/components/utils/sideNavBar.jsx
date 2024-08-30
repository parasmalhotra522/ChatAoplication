import {
  Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  Input,
  useDisclosure,
  DrawerHeader,
  useToast,
  Spinner,

} from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { Avatar } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider.js';
import ProfileModal from './MyProfileModal.jsx';
import { useNavigate } from 'react-router-dom';
import ChatLoader from './ChatLoader.jsx';
import axios from '../../axios.config.js';
import UserListItem from '../UserListItem.jsx';
import { getSender } from './chatlogic.js';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const SideNavBar = () => {

  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loadingChat, setLoadingChat] = useState(false);

  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('userInfo');
    navigate('/');    
  }

  const { user, setSelectedChat, chats, setChats, notifications, setNotifications} = ChatState();

  const toast = useToast();

  //--- Search the user from the database
  const handleSearch = async () => {

  
    if (!search) {
      toast({
        title: `Search User can't be left empty`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
     
    }
    try {
      setLoading(true);
      // ----APi call to the backend
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const {data} = await axios.get(`/api/user?search=${search}`,
      config       
      )
      console.log('checkign the response', data);
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

  const accessChat = async (userId) => {
    // start chat with the user
    console.log("trying to have chat with ", userId); 
    setLoadingChat(true);

    //--- now we have to create a chat of loggedIn user and the selectedId user
    try {
       const config = {
         headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(`/api/chats`, {userId}, config);
        console.log("Checking ..... if the chat is creted or not", data);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
      setLoadingChat(false);
    }
  }

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip hasArrow label='Search users to chat'
          placement='bottom-end'>
          <Button variant='ghost'
            onClick={onOpen}
          >
            <IoIosSearch />
            <Text d={{base:"none", md:'flex'}} px='4'>Search User</Text>
          </Button>

        </Tooltip>
        <Text fontFamily='Work sans' fontSize='2xl'>Lets2alk - The Chat Application</Text>
      <div>
      <Menu>
            <MenuButton p={1} fontSize='2xl' >
              <NotificationBadge count={notifications.length} effect={Effect.SCALE}/>
              <FaBell m={1} />
        </MenuButton>
          {/* to showcase the menu of the notifications to be showcased once user clicks on the 
        bell icon for the notification */}
            <MenuList pl={2}>
              {!notifications && "No New Messages"}
              {notifications.map((notification) => (
                <MenuItem key={notification._id}

                  onClick={
                    () => {
                      setSelectedChat(notification.chat);
                      setNotifications(notifications.filter((n)=>n!==notification))
                    }
                  }
                
                
                >
                  {notification.chat.isGroupChat
                    ? `New Message in ${notification.chat.chatName}`
                    : `New Message from ${getSender(user, notification.chat.users)}`
                  }

                </MenuItem>
              ))}
          </MenuList>
        </Menu>
      
        {/* Profile Menu  */}
        <Menu p={2}>
            <Avatar size='sm' cursor='pointer' name={user.name}
              src={user.profilePicture}
            />
            <MenuButton p={1}>{<FaChevronDown />}</MenuButton>
            
            <MenuList>
              <ProfileModal user={user}>
              <MenuItem>
                My Profile
                 {/*  children={true} */}
                  
                
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
         
              <MenuItem as='a' onClick={handleLogOut}>
                LogOut
              </MenuItem>
                  
            </MenuList>
        </Menu>

        </div>
        

        {/* // ---- side drawer */}

         <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
            <DrawerHeader
            borderBottomWidth='1px'
            >Search Users</DrawerHeader>

            <DrawerBody>
              <Box display='flex' pb={1}>
              <Input placeholder='Search User by email or Name'
                  value={search}
                  mr={2}
                onChange={(e)=>setSearch(e.target.value)}
              
              />
              <Button onClick={handleSearch}>
                Go
              </Button>
               
              </Box>
            {console.log("Checking loading....", searchResult)}
                {loading ? <ChatLoader /> : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)}
                  />
                 ))
                
                )}
          </DrawerBody>
            {loadingChat && <Spinner />}
        </DrawerContent>
      </Drawer>

      </Box>
    </>
  )
}

export default SideNavBar
