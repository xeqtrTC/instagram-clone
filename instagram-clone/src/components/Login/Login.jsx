import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import Footer from '../Footer/Footer';
import { loginUser } from '../api/instagramApi';
import ErrorComponent from '../Error/ErrorComponent';
import GetCSRFToken from '../Hooks/GetCSRFToken';

export default function Login() {
    const [error, setErrorMessage] = useState(null);
    const [valueInputs, setValueInputs] = useState({
        username: '',
        password: ''
    })

    const loginUserMutate = useMutation(loginUser, {
        onSuccess: () => {
            navigate('/')
        },
        onError: (error) => {
            console.log(error.response.data.message, 'error');
            setErrorMessage(error.response.data.message)
        }
    })

    const navigate = useNavigate();


    const usernameRef = useRef();
    const passwordRef = useRef();

    const sendLoginInfo = (e) => {
        e.preventDefault()
        const username = valueInputs.username;
        const password = valueInputs.password
        if(username && password) {
            
            loginUserMutate.mutate({username, password})
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value

        setValueInputs({...valueInputs, [name]: value})
    }
    const [usernameFocus, setUsernameFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [secondUsernameFocus, setSecondUsernameFocus] = useState(false);
    const [secondPasswordFocus, setSecondPasswordFocus] = useState(false)

    useEffect(() => {
        if(usernameFocus) {
            usernameRef.current.focus()
        }
    }, [usernameFocus, usernameRef])
    useEffect(() => {
        if(valueInputs.username.length > 0) {
            setUsernameFocus(true)
        } else (
            setUsernameFocus(false)
        )
    }, [valueInputs, usernameFocus])
    useEffect(() => {
        if(passwordFocus) {
            passwordRef.current.focus()
        }
    }, [passwordFocus])
    useEffect(() => {
        if(valueInputs.password.length > 0) {
            setPasswordFocus(true)
        } else { 
            setPasswordFocus(false)
        }
    }, [valueInputs.password, passwordFocus])

    useEffect(() => {
        if(error) {
            const timer = setTimeout(() => {
                setErrorMessage(null)
            }, [4000])
        return () => clearTimeout(timer)
        }
    }, [error])

  return (
    <>
    <div className='flex items-center justify-center py-40'>
        <div className='flex flex-col min-w-[20%] m-auto'>
            <div className='border border-[#DBDBDB]  py-5 flex flex-col px-8'>
                <form onSubmit={sendLoginInfo}>
                <div className='flex justify-center'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png' alt='photo' className='object-fit  w-32' />
                </div>
                <div>
                    <GetCSRFToken />
                    <div className='flex flex-col'>
                    {
                                error ? (
                                    <ErrorComponent error={error} />
                                ) : null
                            }
                        <div className='pt-2'>
                            
                            <div className='flex flex-col'>
                                <div className={`flex items-center rounded-[4px] bg-[#FAFAFA]/80 border ${secondUsernameFocus ? 'border-[#a8a8a8]' : 'border-[#dbdbdb]' } min-w-full   transition duration-100 ease-in `}>
                                    <input type='text'  name='username' value={valueInputs.username} ref={usernameRef} onBlur={() => setSecondUsernameFocus(false)} onChange={handleChange} onFocus={() => setSecondUsernameFocus(true)} className={` ${usernameFocus ? 'pt-6 pb-1 py-0 ' : null } px-2 py-3.5  w-full  placeholder:text-[#dbdbdb] rounded-[4px] bg-[#FAFAFA]/80 outline-none text-xs  `} />
                                    <span className={`absolute pointer-events-none	 ${usernameFocus ? 'mb-5 transition duration-700 ease-in text-xs' : 'text-xs  transition duration-700 ease-in '}    px-2`} >Phone number, username, or email</span>
                                    <div className='px-2'>
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <div className='pt-2'>
                            <div className='flex flex-col'>
                                <div className={`flex items-center rounded-[4px] bg-[#FAFAFA]/80 border ${secondPasswordFocus ? 'border-[#a8a8a8]' : 'border-[#dbdbdb]' }  transition duration-100 ease-in `}>
                                    <input type={`${showPassword ? 'text' : 'password'}`}  name='password' value={valueInputs.password} ref={passwordRef} onChange={handleChange} onBlur={() => setSecondPasswordFocus(false)} onFocus={() => setSecondPasswordFocus(true)} className={` ${passwordFocus ? 'pt-6 pb-1 py-0 ' : null } px-2 py-3.5  w-full  placeholder:text-[#dbdbdb] rounded-[4px]  bg-[#FAFAFA]/80 outline-none text-xs  `} />
                                    <span className={`absolute pointer-events-none	${passwordFocus ? 'mb-5 transition duration-700 ease-in text-xs' : 'text-sm  transition duration-700 ease-in '} px-2`} >Password</span>
                                    <div className='px-2'>
                                        {
                                            passwordFocus && (
                                                <span className='cursor-pointer' onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</span>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-4'>
                    <button className='rounded-lg text-[#fff] hover:bg-[#1877f2] transition duration-100 ease-out items-center font-medium flex bg-[#0095F6] flex justify-center py-1 w-full'>Sign up</button>
                </div>
                <div className='py-3 flex items-center'>
                    <div className='text-center h-[0.1px] bg-[#dbdbdb] w-[50%]' />
                        <span className='px-4 text-[#8e8e8e]'>OR</span>
                <div className='text-center h-[0.1px] bg-[#dbdbdb] w-[50%]' />
                </div>
                <div className='text-center'>
                    <span>Forgot password?</span>
                </div>
                </form>
                </div>
                
            <div className='text-center border border-[#DBDBDB]  py-5 flex flex-col px-8 mt-3'>
                <span>Don't have an account? <Link to='/login/'><span className='text-[#0095f6]'>Sign up</span></Link></span>   
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
