import React, {useState} from 'react'

import {
    VStack,
    FormControl,
    FormLabel,
    FormHelperText,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    useToast
} from '@chakra-ui/react'

import axios from '../../axios.config.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [formData, SetFormData] = useState({
        emailId: '',
        password: '',
    });
    const [error, setError] = useState({
        emailIdError: '',
        passwordError: '',
    });

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // console.log("checkign form data", formData);
    
    const handleOnChange = async (property, value) => {
         
        const updatedFormData = { ...formData, [property]: value };
        SetFormData(updatedFormData);
        validateField(property, value);

    }

      const handleOnShow = () => {
        setShow(!show);
    }
  
    const validateField = (property, value) => {
        let updatedErrors = { ...error };
        
        switch (property) {
            case 'emailId':       
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                updatedErrors.emailIdError = emailRegex.test(value.trim()) ? '' : '* Please Enter a Valid Email';
                // console.log('inside.., updated error',updatedErrors)
                break;           
            default:
                break;
        }
         setError(updatedErrors);
    }

  const handleOnSubmit = async () => {
    console.log("Checking login...", formData);
    setLoading(true);
    try {
      const result = await axios.post(`/api/user/login`, formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      console.log("api result", result);
      
      toast({
                title: "LogIn Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
      });
      setLoading(false);

      // navigate('/chats');
      localStorage.setItem("userInfo", JSON.stringify(result.data))
      navigate('/chats');
    } catch (error) {
      console.log("Check error", error);
      toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      setLoading(false);
    }



  }

  return (
    <VStack
    spacing={4}
    align='stretch'>
   <FormControl isRequired id='emailId'>
  <FormLabel>Email</FormLabel>
        <Input placeholder='enter your Email Id'
          value={formData.emailId}
          onChange={(e) => { handleOnChange('emailId', e.target.value) }} />

           {
                  error.emailIdError && (
                      <FormHelperText color={'red'}> 
                          {console.log('!!!!!!!inside label',error.emailIdError)}
                            {error.emailIdError}         
                      </FormHelperText>
                )
        }        
          
          
          </FormControl>

           <FormControl isRequired id='password'>
              <FormLabel>Password</FormLabel>
              <InputGroup>
              
          <Input placeholder='Enter your Password'
             value={formData.password}
                    type={show ? 'text' : 'password'}
                    onChange={(e) => { handleOnChange('password', e.target.value) }} />
              
                  <InputRightElement width='4.5rem'>
                      <Button h='1.75rem' size='sm' onClick={handleOnShow}>
                          {show ? 'Hide' : 'Show'}
                      </Button>
                  </InputRightElement>
              
              </InputGroup>

               {
                  error.passwordError && (
                      <FormHelperText color={'red'}> 
                          {/* {console.log('!!!!!!!inside label',error.passwordError)} */}
                            {error.passwordError}         
                      </FormHelperText>
                )
        }      
          </FormControl>
          {/* {console.log('----Check--', Object.values(formData).every(e=>e !== ''))} */}
          <Button
              isLoading={loading}
              loadingText='Submitting'
              onClick={handleOnSubmit}
               isDisabled={!Object.values(formData).every(e=>e !== '')}
                variant='outline'
              colorScheme='teal'
    
  >
    LogIn
          </Button>
          
           <Button
              onClick={() => {
                  SetFormData({
                    emailId: "guest@example.com",
                    password: "123456"
                  })
              }}
              colorScheme='red' 
              width='100%'
            variant='solid'
            
    
  >
    Get Guest User Credentials
          </Button>



      </VStack>
      


  )
}
