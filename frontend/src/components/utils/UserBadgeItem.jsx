import React from 'react'
import { Button } from '@chakra-ui/react'
import { IoIosClose } from "react-icons/io";
const UserBadgeItem = ({user, handleFunction}) => {
  return (
      <Button
          
          onClick={handleFunction}
          bgColor='purple'
          color='white'
          variant='solid'
          fontSize={12}
          cursor='pointer'
          m={1}
          mb={2}
          px={2}
          py={1}
          borderRadius='lg'
          _hover={{
              transform:'scale(1.1)'
          }}
        
      
      >
          {user.name}
          <IoIosClose fontSize='lg' />
    </Button>
  )
}

export default UserBadgeItem
