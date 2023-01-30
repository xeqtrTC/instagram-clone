import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useMutation, useQuery,  } from 'react-query'
import Footer from '../Footer/Footer'
import { addUser } from '../api/instagramApi'
import ErrorComponent from '../Error/ErrorComponent'
import Success from '../Success/Success'

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u

export default function Register() {
    
    const [errorValue, setErrorValue] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [valueInputs, setValueInputs] = useState({
        email: '',
        fullName: '',
        username: '',
        password: ''
    })

    const adduserMutation = useMutation(addUser, {
        onSuccess: () => {
            setValueInputs({
                email: '',
                username: '',
                password: ''
            })
            setSuccessMessage('You registered successfully, please check your email')
        },
        onError: (error) => {
            const { response } = error;
            const errorValueFromBackend = response.data[0]
            if(errorValueFromBackend == 'users with this username already exists.') {
                setErrorValue('That username already exists!')
            } else if (errorValueFromBackend == 'users with this email already exists.') {
                setErrorValue('That email already exists!')
            }
        }
    })


    const addtest =  (e) => {
        e.preventDefault()
        const email = valueInputs.email;
        const username = valueInputs.username;
        const password = valueInputs.password;
        try {
            if(email && username && password) {
                adduserMutation.mutate({email, username, password})
                
            }
        } catch (error) {
            console.log(error);
        }

    }


    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value

        setValueInputs({
            ...valueInputs,
            [name]: value
        })
    }
    const [emailFocus, setEmailFocus] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [secondEmailFocus, setSecondEmailFocus] = useState(false);
    const [secondUsernameFocus, setSecondUsernameFocus] = useState(false)
    const [secondPasswordFocus, setSecondPasswordFocus] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false)
    const [usernameValid, setUsernameValid] = useState(false);

    const test = () => {
        setSecondPasswordFocus(true)
        setPasswordFocus(true);
    }

    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const isBooleanValue = [usernameValid, passwordValid, emailValid].every(Boolean);

    useEffect(() => {
        if(emailFocus) {
            emailRef.current.focus()
        }
    }, [emailRef, emailFocus])
    useEffect(() => {
        if(passwordFocus) {
            passwordRef.current.focus()
        }
    }, [passwordFocus])
    useEffect(() => {
        if(valueInputs.password.length > 0) {
            setPasswordFocus(true)
            setPasswordValid(PASSWORD_REGEX.test(valueInputs.password))
        } else { 
            setPasswordFocus(false)
        }
    }, [valueInputs.password, passwordFocus])
    // useEffect(() => {
    //     if(usernameFocus) {
    //         usernameRef.current.focus()
    //     }
    // }, [usernameFocus, usernameRef])
    useEffect(() => {
        if(valueInputs.username.length > 0) {
            setUsernameFocus(true)
            setUsernameValid(USERNAME_REGEX.test(valueInputs.username))
        } else (
            setUsernameFocus(false)
        )
    }, [valueInputs, usernameFocus])
    useEffect(() => {
        if(valueInputs.email.length > 0)  {
            setEmailFocus(true)
            setEmailValid(EMAIL_REGEX.test(valueInputs.email))
        } else {
            setEmailFocus(false)
        }
    }, [valueInputs.email, emailFocus])
    useEffect(() => {
        if(errorValue) {
            const timer = setTimeout(() => {
                setErrorValue(null)
            }, [4000])
            return () => clearTimeout(timer)
        }      
    }, [errorValue])
    useEffect(() => {
        if(successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null)
            }, [4000])
            return () => clearTimeout(timer)
        }
    }, [successMessage])
  return (
    <>
        <div className='flex justify-center items-center  h-screen'>
            <div className='flex flex-col w-[20%] min-w-[20rem] m-auto'>
                <div className='border border-[#DBDBDB]  py-5 flex flex-col'>
                    <div className='justify-center flex-col flex px-10'>
                        <form onSubmit={addtest}>

                        <div className='flex justify-center'>
                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png' alt='photo' className='object-fit  w-32' />
                        </div>
                        <div className='text-center'>
                            <span className='text-[#8e8e8e] text-lg font-bold'>Sign up to see photos and videos from your friends</span>
                        </div>
                        <div className='py-5'>
                            <button className='rounded-lg text-[#fff] hover:bg-[#1877f2] transition duration-100 ease-out items-center font-medium flex bg-[#0095F6] flex justify-center py-1 w-full'><img className='w-5 h-5 object-fit' src='https://www.mitchellcountylibrary.org/social-facebook-icon-3.png/@@images/image.png' /> <span className='px-2'>Log In with Facebook</span></button>
                        </div>
                        <div className='py-3 flex items-center'>
                            <div className='text-center h-[0.1px] bg-[#dbdbdb] w-[50%]' />
                                <span className='px-4 text-[#8e8e8e]'>OR</span>
                            <div className='text-center h-[0.1px] bg-[#dbdbdb] w-[50%]' />
                        </div>
                        {
                            successMessage ? (
                                <Success successMessage={successMessage} />
                            ) : null
                        }
                        {
                            errorValue ? (
                                <ErrorComponent error={errorValue} />
                            ) : null
                        }
                        <div className='py-5 flex flex-col'>
                            <div className='pt-2'>
                                <div className='flex flex-col'>
                                    <div className={`flex items-center rounded-[4px] bg-[#FAFAFA]/80 border ${secondEmailFocus ? 'border-[#a8a8a8]' : 'border-[#dbdbdb]' }  transition duration-100 ease-in `}>
                                        <input type='text' autoComplete='off' name='email' value={valueInputs.email} ref={emailRef} onChange={onChange} onBlur={() => setSecondEmailFocus(false)} onFocus={() => setSecondEmailFocus(true)} className={` ${emailFocus ? 'pt-6 pb-1 py-0 ' : null } px-2 py-3.5  w-full  placeholder:text-[#dbdbdb] rounded-[4px]  outline-none text-xs relative bg-[#FAFAFA]/80 `} />
                                        <span className={`absolute pointer-events-none	${emailFocus ? 'mb-5 transition duration-700 ease-in text-xs' : 'text-sm  transition duration-700 ease-in '}    px-2`} onClick={() => setEmailFocus(true)} >Email</span>
                                        <div className='px-2'>
                                            {
                                                secondEmailFocus == false && valueInputs.email.length > 0 ? (
                                                    emailValid ? (
                                                        <FontAwesomeIcon icon={faCircleCheck} className='text-[#54B435]' />

                                                    ) : (
                                                        <FontAwesomeIcon icon={faCircleXmark} className='text-[#DC3535]' />
                                                    )
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>  
                            <div className='pt-2'>
                                <div className='flex flex-col'>
                                    <div className={`flex items-center rounded-[4px] bg-[#FAFAFA]/80 border ${secondUsernameFocus ? 'border-[#a8a8a8]' : 'border-[#dbdbdb]' }  transition duration-100 ease-in `}>
                                        <input type='text' autoComplete='off'  name='username' value={valueInputs.username} ref={usernameRef} onBlur={() => setSecondUsernameFocus(false)} onChange={onChange} onFocus={() => setSecondUsernameFocus(true)} className={` ${usernameFocus ? 'pt-6 pb-1 py-0 ' : null } px-2 py-3.5  w-full  placeholder:text-[#dbdbdb] rounded-[4px]  outline-none text-xs  bg-[#FAFAFA]/80 `} />
                                        <span className={`absolute pointer-events-none	 ${usernameFocus ? 'mb-5 transition duration-700 ease-in text-xs' : 'text-sm  transition duration-700 ease-in '}    px-2`} onClick={() => setUsernameFocus(true)}>Username</span>
                                        <div className='px-2'>
                                            {
                                                secondUsernameFocus == false && valueInputs.username.length > 0 ? (
                                                    usernameValid ? (
                                                        <FontAwesomeIcon icon={faCircleCheck} className='text-[#54B435]' />

                                                    ) : (
                                                        <FontAwesomeIcon icon={faCircleXmark} className='text-[#DC3535]' />
                                                    )

                                                ) : null
                                            }                                        </div>
                                    </div>
                                </div>
                            </div>  
                            <div className='pt-2'>
                                <div className='flex flex-col'>
                                    <div className={`flex items-center rounded-[4px] bg-[#FAFAFA]/80 border ${secondPasswordFocus ? 'border-[#a8a8a8]' : 'border-[#dbdbdb]' }  transition duration-100 ease-in `}>
                                        <input type='password' autoComplete='off'  name='password' value={valueInputs.password} ref={passwordRef} onChange={onChange} onBlur={() => setSecondPasswordFocus(false)} onFocus={() => setSecondPasswordFocus(true)} className={` ${passwordFocus ? 'pt-6 pb-1 py-0 ' : null } px-2 py-3.5  w-full  placeholder:text-[#dbdbdb] rounded-[4px]  outline-none text-xs bg-[#FAFAFA]/80  `} />
                                        <span className={`absolute pointer-events-none	${passwordFocus ? 'mb-5 transition duration-700 ease-in text-xs' : 'text-sm  transition duration-700 ease-in '} px-2`} onClick={test}>Password</span>
                                        <div className='px-2'>
                                            {
                                                secondPasswordFocus == false && valueInputs.password.length > 0 ? (
                                                    passwordValid ? (
                                                        <FontAwesomeIcon icon={faCircleCheck} className='text-[#54B435]' />

                                                    ) : (
                                                        <FontAwesomeIcon icon={faCircleXmark} className='text-[#DC3535]' />
                                                    )

                                                ) : null
                                            } 
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className='text-center'>
                            <span className='text-[#8e8e8e] text-sm '>People who use our service may have uploaded your contact information to Instagram. Learn More</span>
                        </div>
                        <div className='text-center py-3'>
                            <span className='text-[#8e8e8e] text-sm '>By signing up, you agree to our Terms , Privacy Policy and Cookies Policy </span>
                        </div>
                        <div>
                            <button className='rounded-lg text-[#fff] hover:bg-[#1877f2] transition duration-100 ease-out items-center font-medium flex bg-[#0095F6] flex justify-center py-1 w-full disabled:cursor-not-allowed' disabled={!isBooleanValue}>Sign up</button>
                        </div>
                        </form>
                    </div>    
                </div>
                <div className='border border-[#DBDBDB]  py-10 flex flex-col mt-5 text-center'>
                    <span>Have an account? <Link to='/login/'><span className='text-[#0095f6]'>Log in</span></Link></span>
                </div>
                <div className='py-5'>
                    <div className='text-center'>
                        <span>Get the app.</span>
                    </div>
                    <div className='flex justify-center py-4'>
                        <img src='https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png' alt='photo' className='object-fit w-25 h-10' />
                        <img src='https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png' alt='photo' className='object-fit w-25 h-10 ml-2'/>
                    </div>
                </div>
            </div>

        </div>
        <Footer />
    </>
  )
}
