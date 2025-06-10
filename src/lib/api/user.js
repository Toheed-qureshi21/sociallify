
import axios from "../axios.js"

export const registerUser = async (userData) => {
        try {
                if (!userData.name || !userData.email || !userData.password) {
                  throw new Error("All fields are required");
                }
                const response = await axios.post('/auth/register', userData);
                return response.data;
                
        } catch (error) {
                throw new Error(error?.response?.data?.message || "Something went wrong");
        }
}

export const loginUser = async (userData) => {
    
                if (!userData.email || !userData.password) {
                  throw new Error("All fields are required");
                }
                const response = await axios.post('/auth/login', userData);
                // console.log(response);
                
                return response.data;
       
}

export const getUser = async (cookieStore) => {
  try {
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!accessToken && !refreshToken) {
 
      return null;
    }

    const res = await fetch(`http://localhost:3000/api/auth/profile`, {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    return data.user;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Something went wrong while fetching user data");
  }
};



export const fetchRandomUsers = async() => {
    try {
      const response = await axios.get('/protected/recommend-users');
      return response.data.randomUsers;
    } catch (error) {
      throw new Error(error?.response?.data?.message || "Something went wrong while fetching random users");
    }
}
export const followAndUnfollow = async(userId) => {
      try {
        const response = await axios.post('/protected/follow',{userId});
        return response.data;
      } catch (error) {
        console.log(error);
        
        throw new Error(error?.response?.data?.message || "Something went wrong while following user");
      }
}
