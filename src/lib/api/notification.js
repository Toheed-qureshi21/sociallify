import { Axis3D } from "lucide-react";
import axios from "../axios.js";
import axiosInstance from "../axios.js";

export const getNotifications = async (cookieHeader=null) => {
    // const response =  await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/protected/notifications`,{
    //     method:'GET',
    //     headers:{
    //         Cookie: cookieHeader,
    //         cache:'no-cache'
    //     },
    // });
    const response = await axios.get('/protected/notifications');

    // const data = await response.json();
    return response?.data;
}

export const handleMarkReadNotifications = async (unreadNotificationIds) => {
    const response =  await axios.post(`/protected/notifications/markread`,{unreadNotificationIds})
    return response.data;
}