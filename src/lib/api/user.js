import axios from "../axios.js";


export const registerUser = async (userData) => {
        if (!userData.name,!userData.email || !userData.password) {
           toast.error("All fields are required");
        }
        const response = await axios.post('/auth/register', userData);
        console.log(response);
        return response.data;
}

export const loginUser = async (userData) => {
        if (!userData.email || !userData.password) {
            toast.error("All fields are required");
        }
        const response = await axios.post('/auth/login', userData);
        return response.data;
}
