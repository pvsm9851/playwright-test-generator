"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Github } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user info in localStorage (in a real app, this would come from the auth provider)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "google-user-123",
          name: "Alex Johnson",
          email: "alex@example.com",
          image: "/placeholder.svg?height=32&width=32",
          plan: "free",
          scansUsed: 0,
        }),
      )

      router.push("/")
    } catch (error) {
      console.error("Login failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user info in localStorage (in a real app, this would come from the auth provider)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "github-user-456",
          name: "Sam Developer",
          email: "sam@github.com",
          image: "/placeholder.svg?height=32&width=32",
          plan: "free",
          scansUsed: 0,
        }),
      )

      router.push("/")
    } catch (error) {
      console.error("Login failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(128,0,128,0.15),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(218,112,214,0.1),transparent_40%)]"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Code className="h-10 w-10 text-purple-500 mr-2" />
          <h1 className="text-3xl font-bold text-white">ElementForge AI</h1>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Sign in</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              className="bg-white hover:bg-zinc-100 text-black border-none h-12"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="bg-zinc-950 hover:bg-zinc-900 text-white border-zinc-800 h-12"
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              <Github className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-xs text-center text-zinc-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-zinc-500 text-sm">
          <p>ElementForge AI - Next-gen test automation powered by artificial intelligence</p>
        </div>
      </div>
    </div>
  )
}
