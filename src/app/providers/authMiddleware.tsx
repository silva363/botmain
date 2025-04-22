"use client";

import LoadingPage from '@/components/loadingPage/loadingPage';
import { useGlobalContext } from '@/components/store/authContext';
import { useEffect, useState } from 'react';

export default function AuthMiddleware({ children }: { children: React.ReactNode }) {
    const { setToken, setAddress } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        function authGuard(token: string, needVerify: boolean = true) {
            let isAuthenticated = false;

            if (needVerify) {

            }

            if (token) {
                isAuthenticated = true;
            }

            if (isAuthenticated && window.location.pathname == '/') {
                window.location.href = '/dashboard/home';
            } else if (!isAuthenticated && window.location.pathname !== '/') {
                window.location.href = '/';
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }

        async function fetchData() {
            const token = window.localStorage.getItem('authtoken');
            const address = window.localStorage.getItem('wallet_address');

            if (token) {
                setToken(token);
                setAddress(address);
                authGuard(token);
            } else {
                authGuard('', false);
            }
        }

        if (isLoading == true && typeof window !== undefined) {
            fetchData();
        }
    }, [isLoading, setAddress, setToken]);

    return (
        <>
            {isLoading ? (
                <LoadingPage></LoadingPage>
            ) : (
                <>{children}</>
            )}
        </>
    );
}
