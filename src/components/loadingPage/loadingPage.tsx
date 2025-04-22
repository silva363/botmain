"use client";

import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <p style={{ color: 'white', fontSize: '24px' }}>Loading...</p>
        </div>
    );
};

export default LoadingPage;
