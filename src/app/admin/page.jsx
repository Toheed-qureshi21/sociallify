'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/protected/check-admin', {
                    withCredentials: true
                });
                setData(res?.data?.text || 'Authorized');
            } catch (err) {
                setError(err.response?.text?.message || 'Unauthorized');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex h-full w-full justify-center items-center">
            <h2>{error || data || "Loading..."}</h2>
        </div>
    );
}
