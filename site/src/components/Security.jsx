import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';

function IdleLogout() {
    const navigate = useNavigate();

    // Function to execute when the user is idle
    const onIdle = async (e) => {
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    };

    useIdleTimer({
        timeout: 1000 * 61, // 60 seconds
        onIdle: onIdle,
        debounce: 100
    });
}

export default IdleLogout;
