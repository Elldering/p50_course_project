import React, { useState, useEffect } from 'react';

const DisplayToken = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

    }, []);

    return (
        <div>
            <h2>Access Token</h2>
            <p>{token}</p>
        </div>
    );
};

export default DisplayToken;
