import { faArrowLeft, faBookmark, faCamera, faComment, faGear, faHeart, faPhotoFilm, faShare, faTableCells, faUserCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Header from '../Header/Header'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../Profile/canvasUtils'
import { addpost, FollowUser, infoPublicProfile, postsOfUser, UnfollowUser } from '../api/instagramApi'
import EmojiPicker from 'emoji-picker-react'
import { useParams } from 'react-router-dom'



export default function PublicProfile() {
    const windowRef = useRef();
    const queryClient = useQueryClient();
    const { username } = useParams();



    const [uploadPost, setUploadPost] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [confirmPage, setConfirmPage] = useState(false);
    const [hover, setHover] = useState(null);
    const [viewPost, setViewPost] = useState(false);

    const { data, isSuccess, isLoading } = useQuery(['product', username], () => infoPublicProfile(username))
    const unFollowMutation = useMutation(UnfollowUser, {
        onSuccess: () => {
            console.log('unfollowed')
        }
    })
    const followUserMutation = useMutation(FollowUser, {
        onSuccess: () => {
            console.log('followed')
        }
    })
    console.log(data);

    const followUserFunction = (e) => {
        e.preventDefault();

        let formData = new FormData()
        
        formData.append('username', username)

        followUserMutation.mutate(formData)
    }
    const unFollowUserFunction = (e) => {
        e.preventDefault();

        let formData = new FormData();

        formData.append('username', username)
        unFollowMutation.mutate(formData)
    }

    const [viewPostStates, setViewPostStates] = useState({
        photo: '',
        total_comments: '',
        total_likes: ''
    })

  
    const seePostFunction = ({total_comments, total_likes, photo}) => {
        setViewPostStates({
            photo: photo,
            total_comments: total_comments,
            total_likes: total_likes
        })
        setViewPost(true);
        setHover(null);
    }

    useEffect(() => {
        document.addEventListener("click", testacabaesa, false);
        return () => {
          document.removeEventListener("click", testacabaesa, false);
        };
      }, []);
    const testacabaesa = (e) => {
        if(windowRef.current &&  viewPost && !windowRef.current.contains(e.target)) {
            closePostFunction()

        }
        console.log(e);

        
    }

    
    const closePostFunction = () => {
        setViewPostStates({
            photo: '',
            total_comments: '',
            total_likes: '',
        })
        setViewPost(false);
    }
    
   
    let viewPostButton = null;
    if(viewPost) {
        viewPostButton = (
            <div className='absolute bg-black/50 h-screen w-full z-10' onClick={(e) => testacabaesa(e)}>   
               <div className='absolute flex justify-end py-2 px-5 w-full'>
                            <div className='flex justify-end'>
                            <FontAwesomeIcon icon={faXmark} className='py-2 h-7 w-7 text-white cursor-pointer' onClick={closePostFunction} />
                            </div>
                </div>
                <div className='flex justify-center items-center h-full z-50'  >
                
                    <div className='flex h-[90%]' ref={windowRef}>
                        <div className='bg-black'>
                            <img src={`http://127.0.0.1:8000/${viewPostStates.photo}`} className='w-[50rem] h-full object-fit' /> 
                        </div>
                        <div>
                            <div className='w-[25rem] bg-white h-full'>
                                <div className='flex items-center border-b p-3 border-[#EFEFEF]'>
                                    <div>
                                        <img src='https://oyster.ignimgs.com/mediawiki/apis.ign.com/person-of-interest/b/b9/Poi_harold_finch.jpg' className='rounded-full w-10 h-10' />
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='flex flex-col px-3'>
                                            <span className='font-bold text-sm'>xeqtr</span>
                                            <span>acab</span>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='flex justify-between px-3 py-3 items-center'>
                                        <div className='gap-4 flex'>
                                        <FontAwesomeIcon icon={faHeart} className='w-6 h-6'/>                          
                                        <FontAwesomeIcon icon={faComment} className='w-6 h-6'/>    
                                        <FontAwesomeIcon icon={faShare} className='w-6 h-6'/>                          
                                

                                        </div>
                                        <div>
                                        <FontAwesomeIcon icon={faBookmark} className='w-6 h-6' />                          

                                    </div>
                                </div>
                                <div className='px-3 flex flex-col'>
                                    <span className='font-bold text-sm'>0 Likes</span>
                                    <span className='text-xs mt-2'>0 Likes</span>


                                </div>
                                <div className=' py-2 px-3 flex items-center justify-between '>
                                    <div>
                                    <img className="w-5 h-5 cursor-pointer" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker(val => !val)} />

                                    </div>
                                    <div className='w-[80%]'>
                                    <input type='text' placeholder='Add a comments...' className='py-2  outline-none w-full text-sm'/>
                                    </div>
                                    <div className='flex items-center'>
                                    <span className='flex items-center'>post</span>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    const secondButtonsCombined = (
        <>
        {viewPostButton}
        </>
    )

    let content;

    if(isLoading) {
        content = (
            <p>Loading..</p>
        )
    }
    if(isSuccess) {
        content = (
                <div className='flex '>
                    <div className='w-[20%]'>
                        <Header />
                    </div>
                        
                        {secondButtonsCombined}
                    <div className='justify-center flex w-full'>
                        <div className='pt-8 w-[60%] m-auto'>
                            <div className='flex pb-10 px-10'>
                                <div className='px-24'>
                                    <FontAwesomeIcon icon={faUserCircle} className='w-32 h-32' />
                                </div>
                                <div>
                                    <div className='flex gap-3 items-center'>
                                        <span className='text-[#262626] text-3xl font-light'>{data?.info?.username}</span>
                                        {
                                            data?.info.isUserFollowed ? (
                                                <button className='bg-[#DBDBDB]/40 hover:bg-[#dbdbdb] transition py-1.5  duration-100 ease-in text-sm px-3 font-medium rounded' onClick={unFollowUserFunction}>Following</button>
                                            ) : (
                                                <button className='bg-[#DBDBDB]/40 hover:bg-[#dbdbdb] transition py-1.5  duration-100 ease-in text-sm px-3 font-medium rounded' onClick={followUserFunction}>Follow</button>

                                            )
                                        }
                                        <FontAwesomeIcon icon={faGear} className='h-5 w-10' />
                                    </div>
                                    <div className='py-4 flex gap-12'>
                                        <div className='flex gap-1'>
                                            <span className='font-bold text-[#262626]'>{data.posts.length}</span>
                                            <span>posts</span>
                                        </div>
                                        <div className='flex gap-1'>
                                            <span className='font-bold text-[#262626]'>0</span>
                                            <span>followers</span>
                                        </div>
                                        <div className='flex gap-1'>
                                            <span className='font-bold text-[#262626]'>0</span>
                                            <span>following</span>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <span className='font-bold'>najjacivodje</span>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-[#dbdbdb] h-[1px]'></div>
                            <div className='flex justify-center gap-16'>
                                <div className='border-t border-black py-2 flex items-center'>
                                    <FontAwesomeIcon icon={faTableCells} className='w-3 h-3' />
                                    <span className='text-xs px-2 text-[#8e8e8e] font-medium'>POSTS</span>
                                </div>
                                <div className='border-t border-black py-2 flex items-center'>
                                    <FontAwesomeIcon icon={faTableCells} className='w-3 h-3' />
                                    <span className='text-xs px-2 text-[#8e8e8e] font-medium'>SAVED</span>
                                </div>
                                <div className='border-t border-black py-2 flex items-center'>
                                    <FontAwesomeIcon icon={faTableCells} className='w-3 h-3' />
                                    <span className='text-xs px-2 text-[#8e8e8e] font-medium'>TAGGED</span>
                                </div>
                            </div>
                            {/* <div className='flex justify-center py-20'>
                                <div className='flex flex-col'>
                                    <div className='flex justify-center py-1'>
                                        <FontAwesomeIcon icon={faCamera} className='h-14 w-14' />
                                    </div>
                                    <div className='flex justify-center py-1'>
                                        <span className='text-2xl text-[#262626]'>Share photos</span>
                                    </div>
                                    <div className='flex justify-center text-[#262626] py-1 text-sm'>                                    
                                        <span>When you share photos, they will appear on your profile.</span>
                                    </div>
                                    <div className='flex justify-center py-1'>
                                        <span className='text-[#3AACF7] font-medium hover:text-[#00376b] transition duration-100 ease-in cursor-pointer' onClick={setUpload}>Share your first photo</span>
                                    </div>
                                </div>
                                
                            </div> */}
                            <div className='flex flex-wrap py-5 overflow-hidden'>
                                {
                                    data?.posts?.map((item) => {
                                        const { photo, id, total_likes, total_comments } = item;
                                        return (
                                            <div className='py-2 px-1' key={id}>
                                                <div className='' onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}>
                                                    {
                                                        hover === id &&(
                                                            <div className='absolute bg-black/40 w-52 h-64 transition duration-100 ease-in-out cursor-pointer flex justify-center items-center' onClick={() => seePostFunction({photo, total_comments, total_likes})}>
                                                                <div className='flex items-center'>
                                                                    <div className='flex items-center'>
                                                                        <FontAwesomeIcon icon={faHeart} className='h-5 w-5 text-white px-4' /> <span className='text-white '>{total_likes}</span>

                                                                    </div>
                                                                    <div className='flex items-center'>
                                                                        <FontAwesomeIcon icon={faComment} className='h-5 w-5 text-white px-4' /><span className='text-white '>{total_comments}</span> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    <img src={`http://127.0.0.1:8000/${photo}`} className='w-52 h-64 object-fit ' />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                
                                
                            </div>
                                
                            </div>
                    </div>
                </div>
        )
    }

    


  return content;
}
