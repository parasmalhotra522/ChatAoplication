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
import { useNavigate } from "react-router-dom";
import axios from '../../axios.config.js';

export default function SignUp() {

    const [show, setShow] = useState(false);
    const [formData, SetFormData] = useState({
        name: '',
        emailId: '',
        password: '',
        confirmPassword: '',
        profilePicture:''
    });
   
    const [error, setError] = useState({
        nameError: '',
        emailIdError: '',
         passwordError: '',
        confirmPasswordError: '',
        profilePictureError:''
        
    });

    // const [profilePicture, setprofilePicture] = useState();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const toast = useToast();

    //     const handleValidations = (property) => {
//     switch (property) {
//         case 'name':
//             const nameRegex = /^[a-zA-Z]{2,30}$/;
//             const isValidName = nameRegex.test(formData.name.trim());
//             const nameError = isValidName ? '' : '* Name should contain only alphabetic characters and be between 2 to 30 characters long';
//             setError(prevError => ({ ...prevError, nameError }));
//             break;
//         case 'emailId':
//             const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//             const isValidEmail = emailRegex.test(formData.emailId.trim());
//             const emailIdError = isValidEmail ? '' : '* Please Enter a Valid Email';
//             setError(prevError => ({ ...prevError, emailIdError }));
//             break;
        
//         case 'password':
//             const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//             const isValidPassword = passwordRegex.test(formData.password);
//             const passwordError = isValidPassword ? '' : '* Password should be Atleast 8 character long \n Should contain atleast 1 upper, 1 lower and 1 digit and should contain Special character';
//             // console.log("Check password", passwordError);
//             setError(prevError => ({ ...prevError, passwordError }));
//             break;
        
//         case 'confirmPassword':
//             console.log('confirm password',formData.confirmPassword);
//             const isValidConfirmPassword = formData.password === formData.confirmPassword;
//             console.log('checking if password is valid', formData.password, formData.confirmPassword, isValidConfirmPassword);
//             const confirmPasswordError = isValidConfirmPassword ? '' : '* Password and Confirm Password don\'t Match';  
//             setError(prevError => ({ ...prevError, confirmPasswordError }));
//             break;
//         default:
//             break;
//     }
    // }
    
    const handleOnChange = async (property, value) => {
         
           const updatedFormData = { ...formData, [property]: value };
        SetFormData(updatedFormData);
        validateField(property, value);
       
    }

    
     const validateField = (property, value) => {
        let updatedErrors = { ...error };

        switch (property) {
            case 'name':
                // const nameRegex = /^[a-zA-Z]{2,30}$/;
                const nameRegex = /^[a-zA-Z ]{2,30}$/;
                updatedErrors.nameError = nameRegex.test(value.trim()) ? '' : '* Name should contain only alphabetic characters and be between 2 to 30 characters long';
                break;

            case 'emailId':
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                updatedErrors.emailIdError = emailRegex.test(value.trim()) ? '' : '* Please Enter a Valid Email';
                break;

            case 'password':
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                updatedErrors.passwordError = passwordRegex.test(value) ? '' : '* Password should be Atleast 8 character long \n Should contain atleast 1 upper, 1 lower and 1 digit and should contain Special character';
                break;

            case 'confirmPassword':
                updatedErrors.confirmPasswordError = value === formData.password ? '' : '* Password and Confirm Password don\'t Match';
                break;

            default:
                break;
        }

        setError(updatedErrors);
    };


    
    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }
        if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chatApplication");
            data.append("cloud_name", "dbmvjkopn");
            fetch("https://api.cloudinary.com/v1_1/dbmvjkopn/image/upload",
                {
                    method: "POST",
                    body: data
                }
            ).then((res) => res.json())
                .then((data) => {
                    SetFormData({ ...formData, profilePicture: data.url.toString() });
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            
        }
        else {
           toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
           });
            setLoading(false);
        }
    }

 
    const handleOnShow = () => {
        setShow(!show);
    }

    // ---- Handling onsubmit functionality 
    const handleOnSubmit = async () => {
        console.log('checking formDATA', formData);
        try {
            setLoading(true);
            console.log("Checking formData", formData);
            const { data } = await axios.post(`/api/user/register`,
                formData,
                {
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            ); 
            console.log("Checking the --api result", data);
           
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (err) {
            console.log("Checkng erro", err.response.data.error);
            toast({
                 title: 'Error Occured !',
                description: err.response.data.error,
                status: "error",
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
  align='stretch'
>
  <FormControl isRequired id='name' >
  <FormLabel>Name</FormLabel>
    <Input type='text' placeholder='Name' onChange={(e) => { handleOnChange('name',e.target.value) }} />
              {
                  error.nameError && (
                      <FormHelperText color={'red'}> 
                          {console.log('inside label',error.nameError)}
                            {error.nameError}         
                      </FormHelperText>
                )
        }        
         
         
 </FormControl>
          

 <FormControl isRequired id='emailId'>
  <FormLabel>Email</FormLabel>
    <Input placeholder='enter your Email Id' onChange={(e) => { handleOnChange('emailId',e.target.value) }} />

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
                          {console.log('!!!!!!!inside label',error.passwordError)}
                            {error.passwordError}         
                      </FormHelperText>
                )
        }      
</FormControl>

         {/* ConfirmPassword */}
<FormControl isRequired id='password'>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
              
                  <Input placeholder='Confirm Password'
                    type={show ? 'text' : 'password'}
                    onChange={(e) => { handleOnChange('confirmPassword', e.target.value) }} />
              
                  <InputRightElement width='4.5rem'>
                      <Button h='1.75rem' size='sm' onClick={handleOnShow}>
                          {show ? 'Hide' : 'Show'}
                      </Button>
                  </InputRightElement>
              
              </InputGroup>
               {
                  error.confirmPasswordError && (
                      <FormHelperText color={'red'}> 
                          {console.log('!!!!!!!inside label',error.confirmPasswordError)}
                            {error.confirmPasswordError}         
                      </FormHelperText>
                )
        }      
              
          </FormControl>
          

          {/* <FormControl id='profilePicture'>
              
              <FormLabel>Upload your picture</FormLabel>
              <Input
                  type='file'
                  p={1.5}
                  accept="image/*"
                  onChange={(e)=>{postDetails('profilePicture', e.target.files[0])}}
              
              />
    </FormControl> */}

 <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>



          {console.log('error', Object.values(error))}
          {console.log(Object.values(formData).every(d=>d !== ''))}
          <Button colorScheme='blue'
            

            isLoading={loading}
                isDisabled={Object.values(error).some(error => error !== '') || (
    formData.name === '' ||
    formData.emailId === '' ||
    formData.password === '' ||
    formData.confirmPassword === ''
  )}
            onClick={handleOnSubmit}    
          >SignUp</Button>


</VStack>
  )
}
