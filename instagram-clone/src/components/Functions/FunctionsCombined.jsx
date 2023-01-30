import React from 'react'
import { QueryClient, useMutation, useQueryClient } from 'react-query'
import { LikePost, postComment, unlikePost } from '../api/instagramApi'



export const likePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(LikePost, {
        onMutate: async (newPost) => {
            await queryClient.cancelQueries(['followedPosts', newPost.id])
            const response = queryClient.getQueryData(['followedPosts']).find((item) => item.id === newPost.id)
            queryClient.setQueryData(['followedPosts', response.id], response.liked = true)
            return {response}
          },
          onSettled: (error, context, success) => {
            if(error) {
              queryClient.setQueryData(['followedPosts', context])
            }
            if(success) {
              queryClient.invalidateQueries('followedPosts')
            }
          }
    })
}

export const unlikePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(unlikePost, {
        onMutate: async (newPost) => {
          await queryClient.cancelQueries(['followedPosts', newPost.id])
          const response = queryClient.getQueryData(['followedPosts']).find((item) => item.id === newPost.id)
          queryClient.setQueryData(['followedPosts', response.id], response.liked = false)
          return {response}
        },
        onSettled: (error, context, success) => {
          if(error) {
            queryClient.setQueryData(['followedPosts', context])
          }
          if(success) {
            queryClient.invalidateQueries('followedPosts')
          }
        }
      })
}

export const unlikePostMutationProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(unlikePost, {
      onMutate: async ({id, username}) => {
        await queryClient.cancelQueries(['infoPublicProfileTESt', id])
        const response = queryClient.getQueryData(['infoPublicProfileTESt', username])
        const findPostsInResponse = response.posts.find((item) => item.id === id)
        queryClient.setQueryData(['infoPublicProfileTESt', findPostsInResponse.id], findPostsInResponse.liked = false)
        return { findPostsInResponse }
      },
      onSettled: (error, context, success) => {
        if(error) {
          queryClient.setQueryData(['infoPublicProfileTESt', context])
        }
        if(success) {
          queryClient.invalidateQueries('infoPublicProfileTESt')
        }
      }
    })
}

export const likePostMutationProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(LikePost, {
      onMutate: async ({id, username}) => {
          await queryClient.cancelQueries(['infoPublicProfileTESt', id])
          const response = queryClient.getQueryData(['infoPublicProfileTESt', username])
          const findPostsInResponse = response.posts.find((item) => item.id === id)
          queryClient.setQueryData(['infoPublicProfileTESt', findPostsInResponse.id], findPostsInResponse.liked = true)
          return { findPostsInResponse }
        },
        onSettled: (error, context, success) => {
          if(error) {
            queryClient.setQueryData(['infoPublicProfileTESt', context])
          }
          if(success) {
            queryClient.invalidateQueries('infoPublicProfileTESt')
          }
        }
  })
}

export const commentPostMutation = (setCommentValue) => {
  const queryClient = useQueryClient();
    return useMutation(postComment, {
        onSuccess: (info) => {
          const id = info.data.post_id
          queryClient.invalidateQueries(['commentsForPost'])
          setCommentValue((prevValue) => ({...prevValue, [id]: ''}))
        }
      })
}