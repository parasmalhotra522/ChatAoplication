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
  Image,
  Text
} from '@chakra-ui/react'
import { FaEye } from "react-icons/fa";

const ProfileModal = ({user, children}) => {
 const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {/* <Button onClick={onOpen}>{children}</Button> */}
          {
              children ? <span onClick={onOpen}>{children}</span>
                  :
                  <FaEye d={{ base:'flex'}} onClick={onOpen}/>
                  
        }
          <Modal size="lg" isOpen={isOpen} onClose={onClose}
          isCentered
          >
        <ModalOverlay />
        <ModalContent>
                  <ModalHeader fontSize='40px'
                      display='flex'
                      fontFamily='Work sans'
                      justifyContent='center'
                  >
                      {user?.name}
            </ModalHeader>
          <ModalCloseButton />
                  <ModalBody display='flex'
                      flexDir='column'
                      alignItems='center'
                      justifyContent='space-between'
                  >
                      <Image
                          borderRadius='full'
                          boxSize='150px'
                          src={user.profilePicture}
                          alt={user.name}
                         
                      />
                      <Text
                      fontSize={{ base:"20px", md:"24px" }}
                       fontFamily='Work sans'
                      >
                        Email:{user.emailId}
                      </Text>
                          
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default ProfileModal;


