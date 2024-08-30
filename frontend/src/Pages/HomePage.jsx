import React from 'react'
import { Container, Box, Text,TabList,TabPanels, TabPanel, Tabs, Tab  } from '@chakra-ui/react'
import Login from '../components/Authentication/Login.component'
import SignUp from '../components/Authentication/SignUp.component'

export default function HomePage() {
  return (
    <Container maxW='xl' centerContent>
      <Box
         d='flex'
         justifyContent="center"
         p={3}
        bg='white'
        w='100%'
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
>
        <Text fontSize="4xl" fontFamily='Work sans'
          textAlign={"center"}
          color="black"> Lets2alk - Chat Application </Text> 
      
     
      
      </Box>

      <Box
       d='flex'
        justifyContent="center"
         p={3}
        bg='white'
        w='100%'
        m="0px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >

     <Tabs
          
          variant='soft-rounded' 
          size='md'
        
          colorScheme='blue'>
    <TabList mb='1em'>
      <Tab width='50%'>Log In</Tab>
      <Tab width='50%'>Sign Up</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <Login/>
      </TabPanel>
      <TabPanel>
      <SignUp/>
      </TabPanel>
    </TabPanels>
        </Tabs>
        

      </Box>




      </Container>
  )
}
