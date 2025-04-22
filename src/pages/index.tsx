import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAccount } from 'wagmi'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && isConnected) {
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [isConnected, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Welcome to MKR Bot</h1>
      </div>
      <ToastContainer />
    </main>
  )
} 