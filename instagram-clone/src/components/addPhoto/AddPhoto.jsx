import { faArrowLeft, faBookmark, faCamera, faComment, faGear, faHeart, faPhotoFilm, faShare, faTableCells, faUserCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Header from '../Header/Header'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../Profile/canvasUtils'
import { addpost, FollowUser, infoPublicProfile, postsOfUser, UnfollowUser } from '../api/instagramApi'
import EmojiPicker from 'emoji-picker-react'
import {UseAuthHook} from '../Hooks/UseAuthHook'
import ViewPost from '../ViewPost/ViewPost'
import { useNavigate, useParams } from 'react-router-dom'
import AddphotoHook from '../Hooks/AddphotoHook'

const reducer = (state, action) => {
    switch(action.type) {
        case 'uploadphoto':
            return { uploadphoto: true}
        case 'cropPhoto':
            return { cropPhoto: true }
        case 'uploadPost':
            return { uploadPost: true}
        default: return state
    }
}


const initialState = {
    uploadphoto: false,
    cropPhoto: false,
    uploadPost: true
}

const first_flip = () => ({
    type: 'uploadphoto'
})
const second_flip = () => ({
    type: 'cropPhoto'
})
const third_flip = () => ({
    type: 'uploadPost'
})

export default function AddPhoto({shutdowncreate}) {
    const { start, setStart } = AddphotoHook();
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, {initialState})
    const queryClient = useQueryClient();
    const { username: usernameAuth } = UseAuthHook();
    const [uploadPost, setUploadPost] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [testState, setteststate] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [imageSrc, setImageSrc] = useState(null);
    const [rotation, setRotation ] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [confirmPage, setConfirmPage] = useState(false);
    const [hover, setHover] = useState(null);

    const addPostMutation = useMutation(addpost, {
        onSuccess: () => {
            setUploadPost(false)
            setStart(false);
            navigate(`${usernameAuth}`) 
            queryClient.invalidateQueries('postsofUser')
        },
        onError: (error) => {
            console.log(error);
        }
    })


    const readFile = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
        })
      }
      const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, [])
    
    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          console.log(file);
          setteststate(file);
          let imageDataUrl = await readFile(file)
          // apply rotation if needed
        //   const orientation = await getOrientation(file)
        //   const rotation = ORIENTATION_TO_ANGLE[orientation]
        //   if (rotation) {
        //     imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
        //   }
    
          setImageSrc(imageDataUrl)
          dispatch(second_flip())
        }
      }
      
     

    
    const setthistest = () => {
        dispatch(first_flip())
    }
    const setConfirmPageFalse = () => {
        dispatch(third_flip())
        setConfirmPage(false);
    }
    const setUpload = () => {
        setUploadPost(true)
        dispatch(third_flip())
    }
    useEffect(() => {
        if(!start) {
            setUpload()
        }
    }, [start])
    const addPostMutationButton = (e) => {
        e.preventDefault();
        const photo = testState
        let form_data = new FormData();
        const total_comments = 0
        const total_likes = 0
        form_data.append('photo', photo, photo.name)
        form_data.append('total_comments', total_comments)
        form_data.append('total_likes', total_likes)
        console.log(form_data, 'form')
        addPostMutation.mutate(form_data)
    }
    let uploadPhotoState = null;
    if( state.uploadphoto) {
        uploadPhotoState = (
            <div className='rounded-xl  bg-white w-[60%] min-w-[20rem] h-[40rem] m-auto overflow-hidden'>

            <div className='text-center py-2 border-b flex justify-between px-5 items-center'>
                <FontAwesomeIcon icon={faArrowLeft} className=' cursor-pointer h-5' onClick={() => dispatch(second_flip())}/>
                <span className='font-medium text-[#262626] '>Create new post</span>

                <span className='text-[#3AACF7] font-medium hover:text-[#00376b] transition duration-100 ease-in cursor-pointer ' onClick={addPostMutationButton}>Share</span>

            </div>
            <div className='flex py-15'>
                <div className='basis-[70%] h-full'>
                    <img src={imageSrc} alt='photo'  className='h-[100%] w-full'/>
                </div>
                    <div className='p-4 basis-1/2 basis-[30%]'>
                        <div className='flex  items-center'>
                            <img src='https://assets1.cbsnewsstatic.com/hub/i/r/2014/03/17/3e509cc1-8e0e-4c77-a2b3-1f4e6f42633e/thumbnail/1200x630/4e55d241b9c9de39bdf7e3b2c9e44960/104424-wb-0097bc.jpg' alt='photo' className='rounded-full h-10 w-10 object-cover' />
                            <span className='ml-3 font-semibold'>najjacivodje</span>
                        </div>
                        <div className='py-2 '>
                            <textarea  placeholder='Write a caption' className='resize-none max-h-[20rem] h-[10rem] w-full outline-none' />
                        </div>
                    </div>
                </div>
                </div>  
        )
    }
    let cropPhotoadsadasdsadasdas= null;
    if(state.cropPhoto) {
        cropPhotoadsadasdsadasdas = (
            <>
            <div className=' rounded-xl bg-white  w-2/5 h-[40rem] m-auto  overflow-hidden'>

                    <div className='text-center py-2 border-b flex justify-between px-3 items-center'>
                        <FontAwesomeIcon icon={faArrowLeft} className=' cursor-pointer h-5' onClick={() => setConfirmPage(true)} />
                        <span className='font-medium text-[#262626] '>Create new post</span>
                        <span className='text-[#3AACF7] font-medium hover:text-[#00376b] transition duration-100 ease-in cursor-pointer ' onClick={setthistest}>Share</span>
                    </div>
                    <img src={imageSrc} />
                    {/* <div className='relative w-full bg-white h-full'>
                        <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={4 / 3} setImageRef={false}
                            onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />

                    </div> */}
                </div></>
       )
    }
    let uploadPostState = null;
    if(state.uploadPost) {
        uploadPostState = (
        <>
            <div className=' rounded-xl bg-white  w-2/5 h-[40rem] m-auto border overflow-hidden'>

                <div className='text-center py-2 border-b'>
                    <span className='font-medium text-[#262626] '>Create nerasrsarasw post</span>
                </div>
                <div className='flex justify-center py-60'>
                        <div className='flex  flex-col text-center'>
                            <div className='flex justify-center'>
                                <FontAwesomeIcon icon={faPhotoFilm} className='w-16  h-16' />
                            </div>
                            <span className='py-2'>Drag photos here</span>
                            <label htmlFor='inputfile' className='bg-[#0095F6] py-1 rounded-md text-white font-medium px-5 text-sm hover:bg-[#1877f2] transition duration-100 ease-in cursor-pointer'>Select from computer</label>
                            <input type='file' id='inputfile' name='inputfile' className='hidden ' onChange={onFileChange}  multiple accept="image/*" />
                        </div>
                    </div>
                </div>
                </> 
        ) 
    }
    const buttonsCombined = (
        <>
        {uploadPhotoState}
        {cropPhotoadsadasdsadasdas}
        {uploadPostState}
        </>
    )

  return (
    <div className='fixed bg-black/50 h-screen w-full '>   
                                
                                <div className='flex justify-end py-2 px-5 '>
                                    <FontAwesomeIcon icon={faXmark} className='py-2 h-7 w-7 text-white cursor-pointer' onClick={shutdowncreate} />
                                </div>
                            <div className='flex items-center  justify-center h-[80%] '>
                        
                
                                {buttonsCombined}
                                {confirmPage ? (

                                    <div className='absolute bg-black/60  w-full h-screen flex justify-center items-center z-100'>
                                    <div className='flex justify-center w-[24rem] bg-white  rounded-xl'>
                                        <div className=' flex flex-col text-center w-full'>
                                            <div className='flex flex-col py-5'>
                                                <span className='font-mediumbold text-xl'>Discard post?</span>
                                                <span className='text-[#8e8e8e] py-2'>If you leave, your edits won't be saved.</span>
                                            </div>

                                            <div className='py-2 border-t border-[#dbdbdb]'>
                                                <span className='text-[#ed4956] font-bold cursor-pointer' onClick={setConfirmPageFalse}>Discard</span>
                                            </div>
                                            <div className='py-2 border-t border-[#dbdbdb]' onClick={() => setConfirmPage(false)}>
                                                <span className='cursor-pointer'>Cancel</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            ) : null}               
                                            

                                {/* <div className='relative border w-full h-full'>
                                    <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={4 / 3} setImageRef={false}
                                        onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom}  /> 
                                </div>  */}
                              
                                 {/* <div className='text-center py-2 border-b'>
                                    <span className='font-medium text-[#262626] '>Create new post</span>
                                </div>
                                <div className='flex justify-center py-60'>
                                    <div className='flex  flex-col text-center'>
                                        <div className='flex justify-center'>
                                        <FontAwesomeIcon icon={faPhotoFilm} className='w-16  h-16' />
                                        </div>
                                        <span className='py-2'>Drag photos here</span>
                                        <label htmlFor='inputfile' className='bg-[#0095F6] py-1 rounded-md text-white font-medium px-5 text-sm hover:bg-[#1877f2] transition duration-100 ease-in cursor-pointer'>Select from computer</label>
                                        <input type='file' id='inputfile' name='inputfile' className='hidden' onChange={onFileChange}/>
                                    </div>
                                </div>  */}
                                
                            </div>
                            
                            
                        </div>
  )
}