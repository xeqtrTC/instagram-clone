import React, { useRef, useState } from 'react'
import { faArrowLeft, faBookmark, faCamera, faComment, faGear, faHeart, faPhotoFilm, faShare, faTableCells, faUserCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { commentPostMutation, likePostMutation, likePostMutationProfile, unlikePostMutation, unlikePostMutationProfile } from '../Functions/FunctionsCombined'
import { getCommentForPost } from '../api/instagramApi'
import { useQuery } from 'react-query'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { UseAuthHook } from '../Hooks/UseAuthHook'
export default function ViewPost({liked_by, likedWho, id, photo, username, liked, viewPost, closePostFunction, dataOfComments}) {

    const windowRef = useRef()
    const {data, isLoading, isSuccess} = useQuery(['commentsForPost', id], () => getCommentForPost(id))
    const [values, setValues] = useState({
        id: id,
        photo: photo,
        username: username,
        liked: liked,
        likedWho: likedWho,
        liked_by: liked_by.length
    })
    const [commentValue, setCommentValue] = useState({

    });

    const changeValueOfComment = (e) => {
        setCommentValue((prevValue) => ({...prevValue, [id]: e.target.value}))
    }
 
    const testacabaesa = (e) => {
        if(windowRef.current &&  viewPost && !windowRef.current.contains(e.target)) {
            closePostFunction()
        }
        console.log(e);

        
    }
    
    const { mutate: likeMutation } = likePostMutation();
    const { mutate: unLikeMutation } = unlikePostMutation();
    const { mutate: commentMutation } = commentPostMutation(setCommentValue);
    const { mutate: unLikeMutationProfile } = unlikePostMutationProfile();
    const { mutate: likeMutationProfile } = likePostMutationProfile();

    const likePostFunction = (id) => {
        likeMutationProfile({id, username})
        const { liked_by } = values
        setValues((prevValue) => ({...prevValue, liked: true, liked_by: liked_by + 1}))
    }
      const unlikePostFunction = (id) => {
        const { liked, likedWho, liked_by } = values
        console.log('ID', values.id)
        unLikeMutationProfile({id, username});
        setValues((prevValue) => ({...prevValue, liked: false, liked_by: liked_by - 1 }))
        
      }
      const commentPostFunction = ({e, id}) => {
        e.preventDefault();
        const comment = commentValue[id]
        commentMutation({comment, id})
      }

    return (
    <div className='fixed bg-black/50 h-screen w-full z-10' onClick={(e) => testacabaesa(e)}>   
               <div className='absolute flex justify-end py-2 px-5 w-full'>
                            <div className='flex justify-end'>
                            <FontAwesomeIcon icon={faXmark} className='py-2 h-7 w-7 text-white cursor-pointer' onClick={closePostFunction} />
                            </div>
                </div>
                <div className='flex justify-center items-center h-full z-50'  >
                
                    <div className='flex h-[90%]' ref={windowRef}>
                        <div className='bg-black'>
                            <img src={`http://127.0.0.1:8000/${values.photo}`} className='w-[50rem] h-full object-fit' /> 
                        </div>
                        <div>
                            <div className='w-[25rem] bg-white h-full'>
                                <div className='flex items-center border-b p-3 border-[#EFEFEF]'>
                                    <div>
                                        <img src='https://oyster.ignimgs.com/mediawiki/apis.ign.com/person-of-interest/b/b9/Poi_harold_finch.jpg' className='rounded-full w-10 h-10 object-cover' />
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='flex flex-col px-3'>
                                            <span className='font-bold text-sm'>{values.username}</span>
                                            <span>acab</span>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                </div>
                                <div className='h-[100%]'>
                                    <div className='h-[70%] overflow-hidden overflow-y-scroll'>
                                        {
                                            isLoading ? (
                                                <span>loading</span>
                                            ) : (
                                                isSuccess ? (
                                                    data?.map((item) => {
                                                        return (
                                                            <div className='flex py-3 px-3' key={item.id}>
                                                                <div className='flex items-center'>
                                                                    <img src='https://oyster.ignimgs.com/mediawiki/apis.ign.com/person-of-interest/b/b9/Poi_harold_finch.jpg' className='rounded-full w-10 h-10' />
                                                                </div>
                                                                <div className='px-3 '>
                                                                    <div>
                                                                        <span className='text-[#343434] font-medium'>{item.username}</span>
                                                                        <span className='text-[#262626] px-2'>{item.comment}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className='text-sm text-[#8e8e8e] font-normal'>{formatDistanceToNow(parseISO((item.datetime)), {addSuffix: true})}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                ) : null
                                            )
                                        }
                                        
                                    </div>

                                <div className='h-[20%] border-t-[1px] border-[#EFEFEF]'>
                                    <div className='flex justify-between px-3 py-3 items-center'>
                                        <div className='gap-4 flex'>
                                        {
                                            values.liked ? (
                                            <FontAwesomeIcon icon={faHeart} className={`w-6 h-6 text-[#FF0000] cursor-pointer`}  onClick={() => unlikePostFunction(id)}/>  
                                            ) :  (
                                            <FontAwesomeIcon icon={faHeart} className={`w-6 h-6 cursor-pointer `} onClick={() => likePostFunction(id)}/>  
                                            )
                                        }  
                                        <FontAwesomeIcon icon={faShare} className='w-6 h-6'/>                          
                                

                                        </div>
                                        <div>
                                        <FontAwesomeIcon icon={faBookmark} className='w-6 h-6' />                          

                                    </div>
                                </div>
                                <div className='px-3 flex flex-col'>
                                    {
                                        values.liked_by > 0 ? (
                                            <span className='font-bold text-sm'>{values.liked_by} Likes</span>
                                        ) : (
                                            <span className='font-bold text-sm'>No one</span>
                                        )
                                    }
                                </div>
                                    <div className=' py-2 px-3 flex items-center justify-between '>
                                         
                                            <div className='w-[80%]'>
                                            <input type='text' placeholder='Add a comments...' className='py-2  outline-none w-full text-sm' onChange={changeValueOfComment} value={commentValue[id]}/>
                                            </div>
                                            <div className='flex items-center'>
                                            <span onClick={(e) => commentPostFunction({e, id})} className={`flex items-center text-[#B7DDFF] ${commentValue.length > 0 ? 'text-[#1EA1F7]' : null } cursor-pointer font-medium`}>post</span>
                                            </div>
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
