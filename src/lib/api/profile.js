import axios from "../axios.js";

export const updateProfile = async(formData) => {
    try {
        const response = await axios.post(`/protected/updateProfile`,formData);
        return response?.data;
    } catch (error) {
       throw new Error(error?.response?.data?.message || "Something went wrong");
    }
}
