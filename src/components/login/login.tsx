import React from 'react'
import Link from "next/link";
import { usePathname } from 'next/navigation';

const Login = () => {
  const currentRoute = usePathname();
  return (
    <>
      <Link className={`${currentRoute === "/login" ? "active" : ""}`} href="/login">
        Login
      </Link>
      {}
      
    </>
  )
}

export default Login
