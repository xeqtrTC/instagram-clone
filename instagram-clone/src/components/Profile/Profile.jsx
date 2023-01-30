import { faArrowLeft, faBookmark, faCamera, faComment, faGear, faHeart, faPhotoFilm, faShare, faTableCells, faUserCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Header from '../Header/Header'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './canvasUtils'
import { addpost, FollowUser, infoPublicProfile, postsOfUser, UnfollowUser } from '../api/instagramApi'
import EmojiPicker from 'emoji-picker-react'
import {UseAuthHook} from '../Hooks/UseAuthHook'
import ViewPost from '../ViewPost/ViewPost'
import { useParams } from 'react-router-dom'
import AddphotoHook from '../Hooks/AddphotoHook'




export default function Profile() {
    const queryClient = useQueryClient();
    const { username } = useParams(); 
    const { username: usernameAuth } = UseAuthHook();
    console.log(username);
    const { start, setStart } = AddphotoHook();

    
    const [hover, setHover] = useState(null);
    const [viewPost, setViewPost] = useState(false);

    const [viewPostStates, setViewPostStates] = useState({
        photo: '',
        total_comments: '',
        total_likes: '',
        liked: false,
        likedWho: [],
        liked_by: [],
        id: ''
      })
    

   
    const { data, isSuccess, isLoading } = useQuery(['infoPublicProfileTESt', username], () => infoPublicProfile(username))


    
    
      const onHoverFunction = (id) => {
        setHover(id);
      }     
    
    const seePostFunction = ({id, photo, liked_by, liked, likedWho, username}) => {
        setViewPostStates({
        photo: photo,
        liked: liked,
        liked_by: liked_by,
        username: username,
        likedWho: likedWho,
        liked_by: liked_by,
        id: id
        })
        setViewPost(true);
    }

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

    const followUserFunction = (e) => {
        e.preventDefault();

        followUserMutation.mutate({username})
    }
    const unFollowUserFunction = (e) => {
        e.preventDefault();


        unFollowMutation.mutate({username})
    }
    
    const closePostFunction = () => {
        setViewPostStates({
            photo: '',
            total_comments: '',
            total_likes: '',
        })
        setViewPost(false);
    }

    
    let viewPostButton = null
    if(viewPost) {
        const { photo, username, liked, id, likedWho, liked_by } = viewPostStates
        viewPostButton = (
        <ViewPost id={id} photo={photo}  setViewPostStates={setViewPostStates} likedWho={likedWho} liked_by={liked_by} username={username} liked={liked} viewPost={viewPost} closePostFunction={closePostFunction} />
        )
    }
    
    const secondButtonsCombined = (
        <>
        {viewPostButton}
        </>
    )
    


  return (
    <div className='flex '>
               <div className='sticky top-0'>

                    <Header setStart={setStart} />
                </div>
                
                {secondButtonsCombined}

                


              <div className='justify-center flex  w-full'>
                  <div className='pt-8 w-[60%] h-full m-auto'>
                      <div className='flex pb-10 px-10'>
                          <div className='px-24'>
                              <FontAwesomeIcon icon={faUserCircle} className='w-32 h-32' />
                          </div>
                          <div>
                              <div className='flex gap-3 items-center'>
                                  <span className='text-[#262626] text-3xl font-light'>{username}</span>
                                    {
                                        data?.info.isAuth ? (
                                            <button className='bg-[#DBDBDB]/40 hover:bg-[#dbdbdb] transition py-1.5  duration-100 ease-in text-sm px-3 font-medium rounded'>Settings</button>
                                        ) : (
                                            data?.info.isUserFollowed ? (
                                                <button className='bg-[#DBDBDB]/40 hover:bg-[#dbdbdb] transition py-1.5  duration-100 ease-in text-sm px-3 font-medium rounded' onClick={unFollowUserFunction}>Following</button>
                                            ) : (
                                                <button className='bg-[#DBDBDB]/40 hover:bg-[#dbdbdb] transition py-1.5  duration-100 ease-in text-sm px-3 font-medium rounded' onClick={followUserFunction}>Follow</button>
                                            )
                                        )
                                    }

                                  <FontAwesomeIcon icon={faGear} className='h-5 w-10' />
                              </div>
                              <div className='py-4 flex gap-12'>
                                  <div className='flex gap-1'>
                                      <span className='font-bold text-[#262626]'>{data?.posts.length}</span>
                                      <span>posts</span>
                                  </div>
                                  <div className='flex gap-1'>
                                      <span className='font-bold text-[#262626]'>{data?.info.countFollowers}</span>
                                      <span>followers</span>
                                  </div>
                                  <div className='flex gap-1'>
                                      <span className='font-bold text-[#262626]'>{data?.info.countFollowing}</span>
                                      <span>following</span>
                                  </div>
                              </div>
                              <div className=''>
                                  <span className='font-bold'>{username}</span>
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
                                const { id, photo, liked, likedWho, liked_by, username, } = item;
                                console.log(liked);
                                return (
                                    <div className='py-2 px-1' key={id}>
                                        <div className='' onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}>
                                            {
                                                hover === id &&(
                                                    <div className='absolute bg-black/40 w-52 h-64 transition duration-100 ease-in-out cursor-pointer flex justify-center items-center' onClick={() => seePostFunction({id, photo, liked, likedWho, liked_by, username,})}>
                                                        <div className='flex items-center'>
                                                            <div className='flex items-center'>
                                                                <FontAwesomeIcon icon={faHeart} className='h-5 w-5 text-white px-4' /> <span className='text-white '>{liked_by.length}</span>

                                                            </div>
                                                            <div className='flex items-center'>
                                                                {/* <FontAwesomeIcon icon={faComment} className='h-5 w-5 text-white px-4' /><span className='text-white '>{total_comments}</span>  */}
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
