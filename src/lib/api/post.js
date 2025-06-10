
import axios from '../axios.js';

export const createPost = async (postData) => {
    try {
        const response = await axios.post('/protected/post/create-post',postData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something went wrong while creating the post");
    }
}
    export const getFeedPost = async(cookieHeader=null) => {
        try {
        //      const accessToken = cookieStore.get("access_token")?.value;
        // const refreshToken = cookieStore.get("refresh_token")?.value;
        // if (!accessToken && !refreshToken) {
    
        //   return null;
        // }

            // const response = await fetch(`http://localhost:3000/api/protected/post/posts?userId=${userId}`,{
            //     headers:{
            //         Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
            //     }
            // });
            // if (!userId) {
            //     return null;
            // }
            const response = await axios.get(`/protected/post/posts`,{
                headers:{
                    Cookie: cookieHeader
                }
            });
            // console.log("REsponse in frontend of post ",response.data);
            // const data = await response.json()
            return response.data?.feed;
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }
export const toggleLike = async (postId) => {
    try {
        const response = await axios.post('protected/likes',{postId});
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something went wrong while liking the post");
    }
}
export const deletePost = async(postId) => {
    const response = await axios.delete(`/protected/post/delete-post?postId=${postId}`);
    return response.data;
}