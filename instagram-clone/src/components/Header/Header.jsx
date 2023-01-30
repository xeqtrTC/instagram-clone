import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon,faGear  ,faHouse, faClock,faMagnifyingGlass, faCompass, faMessage, faSquarePlus, faHeart, faUser, faCircleUser, faBars, faBookmark, faBook, faCircleExclamation, faRightFromBracket, faSearch, faCircleXmark, faClose, faSpinner } from '@fortawesome/free-solid-svg-icons'

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { logout, searchusers } from '../api/instagramApi'
import { UseAuthHook } from '../Hooks/UseAuthHook'
import AddphotoHook from '../Hooks/AddphotoHook'
import { motion } from 'framer-motion'

const reducer = (state, action) => {
    switch(action.type) {
        case 'homescreen':
            return { homescreen: true }
        case 'search':
            return { search: true }
        case 'profile':
            return { profile: true }
        
        default: return state
    }

}

const initialState = {
    homescreen: true,
    search: false,
    profile: false
}

export default function Header({setStart, shutdowncreate}) {
    const  [state, dispatch ] = useReducer(reducer, { initialState })
    console.log(state, 'reducer');
    const inputRef = useRef();
    const [moreSettings, setMoreSettings] = useState(false)
    const [open, setOpen] = useState(true);
    const [inputSearchFocus, setInputSearchFocus] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const { data, isSuccess, isLoading} = useQuery('searchUsers', searchusers, {
        enabled: !!state?.search
    })
    const [mappedUsers, setMappedUsers] = useState([])
    const filterUsers = (e) => {
        const filterItems = data.filter((item) => {
            return item.username.toLowerCase().includes(searchValue.toLowerCase())
        })
        setMappedUsers(filterItems);

    }
    useEffect(() => {
        if (searchValue.length > 2) {
            filterUsers();
        }
    }, [searchValue])


    const homescreentype = () => ({
        type: 'homescreen'
    })
    const searchtype = () => ({
        type: 'search'
    })
    const profiletype = () => ({
        type: 'profile'
    })
    

    const testacabaesa = (e) => {
        if(inputRef.current &&  inputSearchFocus && !inputRef.current.contains(e.target)) {
            setInputSearchFocus(false)
        }
        
    }
    const searchButton = () => {
        setOpen(false);
    }
    const searchButtonClose = () => {
        setOpen(true);

    }
    useEffect(() => {
        if (state?.search ) {
            searchButton()
        }
    }, [state?.search])

    useEffect(() => {
        if(state?.initialState?.homescreen || state.homescreen ) {
            searchButtonClose();
        }
    }, [state?.initialState?.homescreen || state.homescreen])
    const inputSearchFocusChange = () => {
        // inputRef.current.focus();
        setInputSearchFocus(true)
    }
    
    const setMoreSettingsFunction = () => {
        setMoreSettings(!moreSettings)
    }
    const { username } = UseAuthHook();
    const logoutMutation = useMutation(logout, {
        onSuccess: () => {
        },
        onError: (error) => {
            console.log(error);
        }
    })
    const onClickSetSearchvalue = () => {
        setSearchValue('');
        setMappedUsers([])
    }
    const logoutUserFunction = (e) => {
        
        e.preventDefault();

        logoutMutation.mutate();
    } 

    

  return (
    <div className='sticky top-0 flex w-96' onClick={(e) => testacabaesa(e)}>
        
        <motion.div
        className='overflow-hidden border-r h-screen border-[#dbdbdb] px-2 py-5'
        animate={{
            width: open ? 300 : 77
        }}

        initial={{
            width: 300
        }}
        >

        <div className='flex flex-col  h-[100%]'>
            <div className='py-2'>
                {
                    open ? (
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png' alt='photo' className='object-fit h-14  w-32' />
                    ) : (
                        <motion.div
                        initial={{
                            opacity: 0
                        }}
                        animate={{ opacity: 1 }}
                        exit={{opacity: 0}}
                        >
                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png' alt='photo' className='object-fit h-14 ' />
                        </motion.div>
                        )
                }
            </div>
            <div className='py-5 h-[90%] w-full '>
                <div className='py-1 '>
                
                    <Link to='/'>
                        <div className='div-hover-header group ' onClick={() => dispatch(homescreentype())}>
                            <FontAwesomeIcon icon={faHouse} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                            <span className={`${!open && 'hidden'} px-7 ${state?.homescreen || state?.initialState?.homescreen ? 'font-medium' : null}`}>Home</span>
                        </div>
                    </Link>
                </div>
                <div className='py-1'>
                    <div className={`div-hover-header group  ${state.search ? 'border border-[#DDDDDD]' : null } `} onClick={() => dispatch(searchtype())}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                        <span className={`${!open && 'hidden'} px-7 font-medium`}>Search</span>
                    </div>
                </div>
                <div className='py-1'>
                    <div className='div-hover-header group'>
                        <FontAwesomeIcon icon={faCompass} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                        <span className={`${!open && 'hidden'} px-7 font-medium`}>Explore</span>
                    </div>     
                </div>
                <div className='py-1'>
                    <div className='div-hover-header group'>
                        <FontAwesomeIcon icon={faMessage} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                        <span className={`${!open && 'hidden'} px-7 font-medium`}>Messages</span>
                    </div>
                </div>
                <div className='py-1'>
                    <div className='div-hover-header group'>
                        <FontAwesomeIcon icon={faSquarePlus} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                        <span className={`${!open && 'hidden'} px-7 font-medium`}>Notification</span>
                    </div>
                </div>
                <div className='py-1'>
                    <div className='div-hover-header group'>
                        <FontAwesomeIcon icon={faHeart} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                        <span className={`${!open && 'hidden'} px-7 font-medium`} onClick={() => setStart(true)}>Create</span>
                    </div>
                </div>
                
                <div className='py-1'>
                    <Link to={`/${username}`}>
                        <div className='div-hover-header group'>
                            <FontAwesomeIcon icon={faCircleUser} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                            <span className={`${!open && 'hidden'} px-7 font-medium`}>Profile</span>
                        </div>
                    </Link>
                    
                </div>

                <div className='py-1'>
                    <div className='div-hover-header group' onClick={logoutUserFunction}>
                        <FontAwesomeIcon icon={faRightFromBracket} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                        <span className={`${!open && 'hidden'} px-7 font-medium`}>Logout</span>
                    </div>
                </div>
                
            </div>
            {
                moreSettings ? (
                    <div className='flex flex-col w-[85%] transition  duration-100 ease-in-out'>
                        <div className='shadow-lg bg-[#fff] flex flex-col'>
                            <div className='div-hover-header-second'>
                                <span>Settings</span>
                                <FontAwesomeIcon icon={faGear} className='flex items-center' />
                            </div>
                            <div className='div-hover-header-second'>
                                <span>Settings</span>
                                <FontAwesomeIcon icon={faBookmark} className='flex items-center' />
                            </div>
                            <div className='div-hover-header-second'>
                                <span>Switch appearance</span>
                                <FontAwesomeIcon icon={faMoon} className='flex items-center' />
                            </div>
                            <div className='div-hover-header-second'>
                                <span>Your activity</span>
                                <FontAwesomeIcon icon={faClock} className='flex items-center' />
                            </div>
                            <div className='div-hover-header-second'>
                                <span>Report a problem</span>
                                <FontAwesomeIcon icon={faCircleExclamation} className='flex items-center' />
                            </div>
                        </div>
                        <div className='py-1.5'>
                            <div className='shadow-lg bg-[#fff] flex flex-col'>
                                <div className='div-hover-header-second'>
                                    <span>Switch accounts</span>
                                </div>
                                <div className='div-hover-header-second'>
                                    <span>Log out</span>
                                </div>

                            </div>
                        </div>
                    </div>
                ) : null
            }
            {
                open ? (
                    <div className='div-hover-header group' onClick={setMoreSettingsFunction}>
                        <FontAwesomeIcon icon={faBars} className='group-hover:scale-110 transition  duration-100 ease-in-out flex items-center h-6' />
                        <span className='px-4 font-medium'>More</span>
                    </div>
                ) : null
            }
        </div>
    </motion.div>



            {
                state?.search ? (
                    <div className='border-r w-full rounded-tr-2xl	rounded-br-2xl	shadow-header	' >
                    <div className=''>
                        <div className='p-5'>
                            <span className='text-2xl text-[#262626] font-medium'>Search</span>
                        </div>
                        <div className='py-3 px-5 w-full'>
                            
                            <div className='relative text-gray-400 focus-within:text-gray-600 block py-4 z-50'>
                                {
                                    inputSearchFocus ? (
                                        <FontAwesomeIcon icon={faClose} className='cursor-pointer  z-50 absolute top-1/2 left-[91%] transform -translate-y-1/2 left-3' onClick={onClickSetSearchvalue} />  
                                    ) : (
                                        <FontAwesomeIcon icon={faSearch} className='pointer-events-none  absolute top-1/2 transform -translate-y-1/2 left-3' />  
                                    )
                                }
                                <input type='text' placeholder='Search' ref={inputRef} value={searchValue} onClick={inputSearchFocusChange} onChange={(e) => setSearchValue(e.target.value)} className={`form-input py-2  bg-[#EFEFEF] placeholder-gray-400 text-gray-500 appearance-none w-full block ${inputSearchFocus ? 'px-3' : 'px-10'} rounded-xl focus:outline-none `} />
                            </div>
                        </div>
                        <div className='border-t border-[#EFEFEF]'>
                        </div>
                        <div className=' py-5'>
                            <div className='flex  justify-between px-5'>
                                <span className=' text-[#262626] font-medium text-base'>Recent</span>
                                <span className='text-[#3AACF7] transition ease-in-out duration-100 hover:text-[#00376b] font-medium text-base cursor-pointer'>Clear all</span>
                            </div>
                            <div className='py-2 overflow-hidden'>
                                {
                                    mappedUsers.map((item) => {
                                        return (
                                            <Link to={`/${item.username}`}>
                                                <div className='py-2 px-5 flex hover:bg-[#8E8E8E]/5 cursor-pointer'>
                                                <div className='w-[20%]'>   
                                                    <img src={'https://static.wikia.nocookie.net/pediaofinterest/images/e/e6/POI_0405_Flashback1.png'} alt='photo' className='rounded-full object-fit w-10 h-10' />
                                                </div>
                                                <div className='w-[75%]'>
                                                    <span className=' text-[#262626] font-medium text-sm'>{item.username}</span>
                                                </div>
                                                <div className='w-[5%] flex items-center'>
                                                    <FontAwesomeIcon icon={faClose} className='' />  
                                                </div>
                                                </div>
                                                
                                            </Link>
                                        )
                                    })
                                }
                                
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
        
                ) : null
            }
























    </div>
    
  )
}
