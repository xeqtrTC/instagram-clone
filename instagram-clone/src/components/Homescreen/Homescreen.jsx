import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Stories from './Stories'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EmojiPicker from 'emoji-picker-react'
import { faBookmark, faComment, faEllipsis, faHeart, faHeartCircleBolt, faShare, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getCommentForPost, LikePost, postComment, PostsOfFollowedUsers, unlikePost } from '../api/instagramApi'
import { Link } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'
import ViewPost from '../ViewPost/ViewPost'
import { commentPostMutation, likePostMutation, unlikePostMutation } from '../Functions/FunctionsCombined'
import { UseAuthHook } from '../Hooks/UseAuthHook'
import AddphotoHook from '../Hooks/AddphotoHook'
import AddPhoto from '../addPhoto/AddPhoto'
import Loader from '../Loader/Loader'
import { motion } from 'framer-motion'
export default function Homescreen() {
  const queryClient = useQueryClient();
  const [showPicker, setShowPicker] = useState(false);
  const [randomId, setRandomId] = useState(0);
  const {username} = UseAuthHook();
  const [commentValue, setCommentValue] = useState({

  }); 
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


  const { mutate } = unlikePostMutation()
  const { mutate: mutateLike } = likePostMutation()
  const { mutate: mutateComment } = commentPostMutation(setCommentValue)


  const { start, setStart } = AddphotoHook()

  const shutdowncreate = () => {
    setStart(value => !value)
  }




  let content;

  const { data, isSuccess, isError, isLoading } = useQuery('followedPosts', PostsOfFollowedUsers) 
  const {data: dataOfComments} = useQuery(['commentsForPost', viewPostStates.id], () => getCommentForPost(viewPostStates.id), {
    enabled: !!viewPost
  } )
  const [test, setTest] = useState(false);

  const testf = () => {
    setTest(true);
  }
  useEffect(() => {
    if(test) {
      const timer = setTimeout(() => {
        setTest(false);
      }, [1000])
      return () => clearTimeout(timer);
    }
  }, [test])

  const onEmojiClick = (emojiObject) => {
    setCommentValue(prevMessage => prevMessage + emojiObject.emoji)
  }
  const changeValueOfComment = (e, id) => {
    console.log(e, id)
    const name = e.target.name
     data.map((x) => {
      if (x.id === id) {
        setCommentValue((prevValue) => ({...prevValue, [id]: e.target.value}))
      }
    })
  }
  const closePostFunction = () => {
    setViewPostStates({
        photo: '',
        total_comments: '',
        total_likes: '',
    })
    setViewPost(false);
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


  const showPickerFunction = (id) => {
    setRandomId(id);
    setShowPicker(!showPicker);
  }

  const commentPostFunction = ({e, id}) => {
    e.preventDefault();
    const comment = commentValue[id]
    mutateComment({comment, id})
  }
  const unlikePostFunction = (id) => {
    mutate({id});
  }

  const likePostFunction = (id) => {
    mutateLike({id})
  }

  let viewPostButton = null;
  if(viewPost) {
    const { photo, username, liked, id, likedWho, liked_by } = viewPostStates
    viewPostButton = (
      <ViewPost id={id} photo={photo} dataOfComments={dataOfComments} setViewPostStates={setViewPostStates} likedWho={likedWho} liked_by={liked_by} username={username} liked={liked} viewPost={viewPost} closePostFunction={closePostFunction} />
    )
  }

  const combinedButtons = (
    <>
    {viewPostButton}
    </>
  )

  const testPhoto = (
    <>
    <AddPhoto />
    </>
  )

  if(isLoading) {
    content = (
 

        <Loader />
    )
  }
  if (isSuccess) {
    content = (
<div className='flex  '>
      {
        start  ? (
          <div className='z-50'>
            <AddPhoto shutdowncreate={shutdowncreate}/>
          </div>
        ) : null
      }
      <div className='sticky top-0'>

        <Header setStart={setStart} shutdowncreate={shutdowncreate}/>
      </div>
      {combinedButtons}
      
      
        <div className='flex relative w-full justify-center '>
            <div className='flex'>
              <div className='max-w-100'>
                <div className=' '>
                   
                    {
                      data?.length > 0 ? (
                          data?.map((item) => {
                            const { id, photo, username, total_comments, liked, total_likes, datetime, likedWho, liked_by } = item;
                            return (
                              <div className='py-4 w-[30rem]' key={id}>
                            <div className='rounded border border-[#dbdbdb]'>
                            {
                                randomId === id && showPicker ? (
                                  <div className='h-[20rem] absolute'>
                                <EmojiPicker height={'25rem'} onEmojiClick={onEmojiClick}/>
                              </div>
                                ) 
                                : null
                              }
                              <div className='flex justify-between items-center py-3 w-full px-3'>
                                <div className='flex items-center'>
                                    <img src={'https://static.wikia.nocookie.net/pediaofinterest/images/e/e6/POI_0405_Flashback1.png'} alt='photo' className='rounded-full object-fit w-10 h-10' />
                                    <Link to={`/${username}`}><span className='ml-3 hover:text-[#8e8e8e] font-medium cursor-pointer transition duration-100 ease-in-out'>{item.username}</span></Link>
                                    <div className='px-2 flex items-center'>
                                        <div className='h-1 w-1 bg-[#8e8e8e]/50 flex items-center'>
    
                                        </div>
                                        <span className='px-2 text-[#8e8e8e]/60 text-sm'>
                                          {formatDistanceToNow(parseISO((datetime)), {addSuffix: true})}
                                        </span>
                                    </div>  
                                </div>
                                <div>
                                  <FontAwesomeIcon icon={faEllipsis} />
                                </div>
                              </div>
                              <div className='w-full  '>
                                <div className='h-full w-full'>
                                  <img src={`http://127.0.0.1:8000/${photo}`} alt='photo' className='object-contain w-full ' />
    
                                </div>
                              </div>
                              <div className='flex justify-between px-3 py-3 items-center'>
                                <div className='gap-4 flex'>
                                  {
                                    item.liked ? (
                                      <FontAwesomeIcon icon={faHeart} className={`w-6 h-6 text-[#FF0000] cursor-pointer ${test ? 'animate-wiggle' : null }`} on onMouseLeave={testf} onClick={() => unlikePostFunction(item.id)}/>  
                                    ) :  (
                                      <FontAwesomeIcon icon={faHeart} className={`w-6 h-6 cursor-pointer  ${test ? 'animate-wiggle': null}`} onMouseLeave={testf} onClick={() => likePostFunction(item.id)}/>  
                                    )
                                  }                        
                                  <FontAwesomeIcon icon={faComment} className='w-6 h-6'/>    
                                  <FontAwesomeIcon icon={faShare} className='w-6 h-6'/>                          
                          
    
                                </div>
                                <div>
                                  <FontAwesomeIcon icon={faBookmark} className='w-6 h-6' />                          
    
                                </div>
                              </div>
                              <div className='py-2 px-3'>
                                <div className='flex items-center'>
                                  <img src={'https://static.wikia.nocookie.net/pediaofinterest/images/e/e6/POI_0405_Flashback1.png'} alt='photo' className='object-cover rounded-full w-6 h-6 ' />
                                    {
                                      item.liked_by.length === 1 ? (
                                        <span className='ml-3'>
                                          Liked by <Link to={`/${likedWho[0]}`} className='font-medium'>{likedWho[0]}</Link>
                                        </span>
                                      ) : (
                                        liked_by.length > 1 ? (
                                          <span className='ml-3'>
                                            {likedWho[0]} and {liked_by.length}
                                          </span>
                                          ) : (
                                          <span className='ml-3'>
                                            No one
                                          </span>
                                        )
                                      )
                                    }
                                </div>
                                
                                <div className='py-1'>
                                  <Link to={`/${username}`}><span className='hover:text-[#8e8e8e] font-medium cursor-pointer transition duration-100 ease-in-out'>{username}</span></Link>
                                  <span className='ml-1'>Da li je ovo zakucavanje godine?</span>
                                </div>
                                {
                                  total_comments > 0 ? (
                                    <div className='py-0.5'>
                                      <span className='text-[#8E8E8E] text-sm font-normal cursor-pointer' onClick={() => seePostFunction({id, photo, liked, likedWho, liked_by, username,})}>View all {item.total_comments} comments</span>
                                    </div>
                                  ) : null
                                }
                                
                                
                                
                              </div>
                              
                              
                                <form onSubmit={(e) => commentPostFunction({id, e})}>
                              <div className=' border-t border-[#efefef] py-2 px-3 flex items-center justify-between '>
                                <div>
                                 <img className="w-5 h-5 cursor-pointer" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={(e) => showPickerFunction(item.id)} />
    
                                </div>
                                <div className='w-[80%]'>
                                  <input type='text' placeholder='Add a comments...' value={commentValue[id]} name='comment' onChange={(e) => changeValueOfComment(e, id)} className='py-2  outline-none w-full text-sm'/>
                                </div>
                                <div className='flex items-center'>
                                  <button className='flex items-center'>post</button>
                                </div>
                              </div>
                                </form>
                            </div>
                            
                          </div>
                            )
                          })
                          
                      ) : (
                        null
                      )
                    }
                      
                    
                        

                   

                  </div>
                
          
                   
                    
              </div>
              <div>
              </div>
            </div>
            <div className='ml-6 w-[20rem]'>
              <div className='flex justify-between items-center py-3'>
                  <div className='flex items-center'>
                  <FontAwesomeIcon icon={faUserCircle} className='h-10' />
                  </div>
                  <div className='flex items-center w-[80%] px-4 text-sm'>
                    <div className='flex flex-col items-center'>
                    <span className='text-[#262626] font-medium'>{username}</span>
                    <span className='text-[#8e8e8e]'>asd</span>
                    </div>
                  </div>
                  <div>
                    <span className='text-[#3AACF7] font-medium cursor-pointer hover:text-[#00376b]'>Switch</span>
                  </div>

              </div>
              <div className='flex justify-between py-2'>
                <span className='text-[#8e8e8e] font-bold'>Suggestions For You</span>
                <span className='text-[#262626] text-sm font-medium '>See All</span>
              </div>
              <div>
                <div className='flex justify-between items-center py-1'>
                    <div className='flex items-center'>
                    <FontAwesomeIcon icon={faUserCircle} className='h-7' />
                    </div>
                    <div className='flex items-center w-[80%] px-4 text-sm'>
                      <div className='flex flex-col items-center'>
                      <span className='text-[#262626] font-medium'>a</span>
                      <span className='text-[#8e8e8e]'>asd</span>
                      </div>
                    </div>
                    <div>
                      <span className='text-[#3AACF7] font-medium cursor-pointer hover:text-[#00376b] text-xs'>Follow</span>
                    </div>

                </div>
                <div className='flex justify-between items-center py-1'>
                    <div className='flex items-center'>
                    <FontAwesomeIcon icon={faUserCircle} className='h-7' />
                    </div>
                    <div className='flex items-center w-[80%] px-4 text-sm'>
                      <div className='flex flex-col items-center'>
                      <span className='text-[#262626] font-medium'>a</span>
                      <span className='text-[#8e8e8e]'>asd</span>
                      </div>
                    </div>
                    <div>
                      <span className='text-[#3AACF7] font-medium cursor-pointer hover:text-[#00376b] text-xs'>Follow</span>
                    </div>

                </div>
                <div className='flex justify-between items-center py-1'>
                    <div className='flex items-center'>
                    <FontAwesomeIcon icon={faUserCircle} className='h-7' />
                    </div>
                    <div className='flex items-center w-[80%] px-4 text-sm'>
                      <div className='flex flex-col items-center'>
                      <span className='text-[#262626] font-medium'>a</span>
                      <span className='text-[#8e8e8e]'>asd</span>
                      </div>
                    </div>
                    <div>
                      <span className='text-[#3AACF7] font-medium cursor-pointer hover:text-[#00376b] text-xs'>Follow</span>
                    </div>

                </div>
                <div className='flex justify-between items-center py-1'>
                    <div className='flex items-center'>
                    <FontAwesomeIcon icon={faUserCircle} className='h-7' />
                    </div>
                    <div className='flex items-center w-[80%] px-4 text-sm'>
                      <div className='flex flex-col items-center'>
                      <span className='text-[#262626] font-medium'>a</span>
                      <span className='text-[#8e8e8e]'>asd</span>
                      </div>
                    </div>
                    <div>
                      <span className='text-[#3AACF7] font-medium cursor-pointer hover:text-[#00376b] text-xs'>Follow</span>
                    </div>

                </div>
              </div>
              <div className='py-2'>
                <div className='text-[#c7c7c7] text-xs gap-3 flex flex-wrap'>
                    <span >About</span>
                    <span >Help</span>
                    <span >Press</span>
                    <span >API</span>
                    <span >Jobs</span>
                    <span >Privacy</span>
                    <span >Terms</span>
                    <span >Locations</span>
                    <span >Language</span>

                </div>
                <div className='text-[#c7c7c7] text-xs gap-3 flex flex-wrap py-5'>
                  <span>&copy; 2022 INSTAGRAM FROM META</span>
                </div>
              </div>
          </div>
        </div>
        
    </div>
    )
  }
  return content;
}
