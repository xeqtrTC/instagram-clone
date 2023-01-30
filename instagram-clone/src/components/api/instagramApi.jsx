import axios from "axios"
import Cookies from "js-cookie"


const instagramApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    withCredentials: true,
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),

    },
})
export const searchusers = async () => {
    const response = await instagramApi.get('searchusers')
    return response.data
}
    export const getCommentForPost = async (id) => {
    const response = await instagramApi.get(`commentsOfPost/${id}`)
    return response.data
}
export const postComment = async (info) => {
    return await instagramApi.post('/commentpost', info)
}
export const unlikePost = async (info) => {
    return await instagramApi.post('unlikepost', info)
}
export const LikePost = async (info) => {
    return await instagramApi.post('likepost', info)
}
export const PostsOfFollowedUsers = async () => {
    const response = await instagramApi.get('postsofFollowedUser');
    return response.data
}
export const UnfollowUser = async (username) => {
    return await instagramApi.post('unfollowuser', username)
}

export const FollowUser = async (username) => {
    return await instagramApi.post('followuser', username)
}

export const infoPublicProfile = async (username) => {
    const response = await instagramApi.get(`publicprofile/${username}`)
    return response.data;
}
export const whoami = async () => {
    const response = await instagramApi.get('whoami')
    return response.data
}
export const logout = async () => {
    return await instagramApi.post('logout')
}
export const addUser = async (adduser) => {
    return await instagramApi.post('/adduser', adduser)
}
export const verifyEmail = async (token) => {
    return await instagramApi.get(`verifyEmail/${token}`)
}
export const loginUser = async (userinfo) => {
    return await instagramApi.post('/loginuser', userinfo)
}
export const getcsrf = async () => {
    const response = await instagramApi.get('/csrftoken')
    return response.data
}
export const addpost = async (post) => {
    return await instagramApi.post('/addpost', post)
}
export const postsOfUser = async () => {
    const response = await instagramApi.get('postsofuser')
    return response.data
}