"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Download, Loader2, Code, Scan, FileCode, Layers, ChevronRight, LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PaymentModal } from "@/components/payment-modal"
import { type Plan, plans, getUserPlan, canUserScan, getScansRemaining, getPagesLimit } from "@/lib/plans"

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pages, setPages] = useState<any[]>([])
  const [progress, setProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState("")
  const [activeTab, setActiveTab] = useState("scan")
  const [user, setUser] = useState<any>(null)
  const [selectedFramework, setSelectedFramework] = useState("playwright")
  const [isBrowser, setIsBrowser] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const router = useRouter()

  // Set isBrowser to true when component mounts
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Simulate user authentication check
  useEffect(() => {
    if (!isBrowser) return

    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser)
      // Initialize user with plan if not set
      if (!parsedUser.plan) {
        parsedUser.plan = "free"
        parsedUser.scansUsed = 0
        localStorage.setItem("user", JSON.stringify(parsedUser))
      }
      setUser(parsedUser)
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }
  }, [router, isBrowser])

  useEffect(() => {
    if (!isBrowser) return

    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem("user")
    if (!loggedInUser) {
      // Redirect to landing page if not logged in
      router.push("/landing")
    }
  }, [router, isBrowser])

  const handleLogout = () => {
    if (!isBrowser) return
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleUpgradePlan = (newPlan: Plan) => {
    if (!user) return

    // Update user plan in localStorage
    const updatedUser = {
      ...user,
      plan: newPlan.type,
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setPaymentModalOpen(false)
  }

  const scanWebsite = async () => {
    if (!url) {
      setError("Please enter a valid URL")
      return
    }

    if (!canUserScan(user)) {
      setError("You've reached your scan limit for this month. Please upgrade your plan to continue.")
      return
    }

    try {
      setLoading(true)
      setError("")
      setPages([])
      setProgress(10)
      setScanStatus("Analyzing main page...")

      // Client-side simulation of API call
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, user }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to analyze website")
      }

      const data = await response.json()
      setPages(data.pages)
      setProgress(100)
      setScanStatus(`Analysis complete - Found ${data.pages.length} unique pages`)

      // Update user's scan count
      if (user) {
        const updatedUser = {
          ...user,
          scansUsed: (user.scansUsed || 0) + 1,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      // Switch to results tab after successful scan
      setActiveTab("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Update the downloadProject function to include the selected framework
  const downloadProject = async () => {
    if (pages.length === 0) {
      setError("No pages to generate project from")
      return
    }

    try {
      setLoading(true)
      setScanStatus(`Generating ${selectedFramework.charAt(0).toUpperCase() + selectedFramework.slice(1)} project...`)

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, pages, framework: selectedFramework }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to generate project")
      }

      // Get the blob from the response
      const blob = await response.blob()

      // Create a download link
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `${selectedFramework}-project.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      setScanStatus("Project downloaded")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download project")
    } finally {
      setLoading(false)
    }
  }

  // Group elements by type for display
  const getElementCounts = (elements: any[]) => {
    const counts: Record<string, number> = {}
    elements.forEach((el) => {
      counts[el.type] = (counts[el.type] || 0) + 1
    })
    return counts
  }

  // Get total element count
  const getTotalElementCount = () => {
    return pages.reduce((total, page) => total + (page.elements?.length || 0), 0)
  }

  // Get user's current plan
  const currentPlan = user ? getUserPlan(user) : plans.free
  const scansRemaining = user ? getScansRemaining(user) : 0
  const pagesLimit = user ? getPagesLimit(user) : 1

  if (!isBrowser) {
    return null // Return null on server-side to prevent hydration errors
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-purple-500" />
              <h1 className="text-xl font-bold tracking-tight">ElementForge AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center mr-4">
                <Badge
                  variant="outline"
                  className="bg-purple-900/30 text-purple-300 border-purple-800 font-normal py-1 px-3"
                >
                  {currentPlan.name} Plan
                </Badge>
                {currentPlan.type === "free" && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setPaymentModalOpen(true)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Upgrade
                  </Button>
                )}
              </div>
              <a
                href="https://playwright.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-300 hover:text-purple-400 transition-colors"
              >
                Docs
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-purple-800">
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-purple-950 text-purple-200">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                      <p className="text-xs leading-none text-zinc-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="focus:bg-zinc-800">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-zinc-300">Plan:</span>
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-800">
                        {currentPlan.name}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  {currentPlan.type === "free" && (
                    <DropdownMenuItem
                      className="text-purple-400 focus:bg-zinc-800 focus:text-purple-300 cursor-pointer"
                      onClick={() => setPaymentModalOpen(true)}
                    >
                      Upgrade Plan
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            AI-Powered Test Element Mapping
          </h2>
          <p className="text-zinc-300 mb-6">
            Automatically map interactive elements from websites and generate test projects in seconds
          </p>
        </div>

        {/* Plan Usage Info */}
        <div className="mb-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Badge className="mr-2 bg-purple-900/50 text-purple-300 border-purple-800">
                    {currentPlan.name} Plan
                  </Badge>
                  {currentPlan.type === "free" && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setPaymentModalOpen(true)}
                      className="text-purple-400 hover:text-purple-300 h-auto p-0"
                    >
                      Upgrade
                    </Button>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Website Scans</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-300">
                        {currentPlan.scanLimit === Number.POSITIVE_INFINITY
                          ? "Unlimited"
                          : `${user.scansUsed || 0} / ${currentPlan.scanLimit}`}
                      </span>
                      {currentPlan.scanLimit !== Number.POSITIVE_INFINITY && (
                        <span className="text-xs text-zinc-500">
                          {scansRemaining} scan{scansRemaining !== 1 ? "s" : ""} remaining
                        </span>
                      )}
                    </div>
                    {currentPlan.scanLimit !== Number.POSITIVE_INFINITY && (
                      <Progress
                        value={(user.scansUsed / currentPlan.scanLimit) * 100}
                        className="h-1.5 bg-zinc-800"
                        indicatorClassName="bg-gradient-to-r from-purple-500 to-fuchsia-500"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Pages Per Scan</p>
                    <p className="text-sm font-medium text-zinc-300">
                      {pagesLimit === Number.POSITIVE_INFINITY ? "Unlimited" : pagesLimit}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950 p-6 md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-800">
                <h4 className="font-medium mb-2">Plan Features</h4>
                <ul className="space-y-1">
                  {currentPlan.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex items-start">
                      <CheckCircle className="h-3 w-3 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="scan" className="data-[state=active]:bg-zinc-800">
              <Scan className="h-4 w-4 mr-2" />
              Scan Website
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-zinc-800" disabled={pages.length === 0}>
              <Layers className="h-4 w-4 mr-2" />
              Results
              {pages.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-purple-900/50">
                  {pages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Website Scanner
                </CardTitle>
                <CardDescription className="text-zinc-300">
                  Enter the URL of the website you want to map. Our AI will analyze the main page
                  {currentPlan.pagesPerScan > 1 ? " and all linked pages" : ""}, focusing only on interactive elements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-zinc-200">
                      Website URL
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 text-zinc-200 focus-visible:ring-purple-500"
                      />
                      <Button
                        onClick={scanWebsite}
                        disabled={loading || !canUserScan(user)}
                        className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Scan className="mr-2 h-4 w-4" />
                            Scan Website
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {currentPlan.type === "free" && (
                    <Alert className="bg-purple-900/20 border-purple-800 text-purple-100">
                      <AlertTriangle className="h-4 w-4 text-purple-400" />
                      <AlertTitle>Free Plan Limitations</AlertTitle>
                      <AlertDescription className="text-purple-200">
                        Your free plan allows scanning of 5 websites per month, limited to the main page only.{" "}
                        <Button
                          variant="link"
                          className="text-purple-300 hover:text-purple-200 p-0 h-auto font-normal"
                          onClick={() => setPaymentModalOpen(true)}
                        >
                          Upgrade your plan
                        </Button>{" "}
                        for unlimited scans and multi-page analysis.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label className="text-zinc-200">Framework</Label>
                    <RadioGroup
                      defaultValue="playwright"
                      value={selectedFramework}
                      onValueChange={setSelectedFramework}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="playwright" id="playwright" />
                        <Label htmlFor="playwright" className="text-zinc-300 cursor-pointer">
                          Playwright
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cypress" id="cypress" />
                        <Label htmlFor="cypress" className="text-zinc-300 cursor-pointer">
                          Cypress
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selenium" id="selenium" />
                        <Label htmlFor="selenium" className="text-zinc-300 cursor-pointer">
                          Selenium
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {loading && (
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-purple-400">{scanStatus}</span>
                        <span className="text-sm font-medium text-zinc-300">{Math.round(progress)}%</span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-2 bg-zinc-800"
                        indicatorClassName="bg-gradient-to-r from-purple-500 to-fuchsia-500"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 bg-zinc-900/50 flex justify-between">
                <div className="text-xs text-zinc-400">Powered by AI to extract interactive elements for testing</div>
                {pages.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("results")}
                    className="text-purple-400 border-purple-900 hover:bg-purple-900/20"
                  >
                    View Results
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {pages.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-purple-400 flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Mapped Pages ({pages.length})
                      </CardTitle>
                      <CardDescription className="text-zinc-300">
                        Found {pages.length} unique pages with {getTotalElementCount()} interactive elements
                      </CardDescription>
                    </div>
                    <div>
                      <RadioGroup value={selectedFramework} onValueChange={setSelectedFramework} className="flex mb-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="playwright" id="r1" />
                          <Label htmlFor="r1" className="text-zinc-300">
                            Playwright
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <RadioGroupItem value="cypress" id="r2" />
                          <Label htmlFor="r2" className="text-zinc-300">
                            Cypress
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <RadioGroupItem value="selenium" id="r3" />
                          <Label htmlFor="r3" className="text-zinc-300">
                            Selenium
                          </Label>
                        </div>
                      </RadioGroup>
                      <Button
                        onClick={downloadProject}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download {selectedFramework.charAt(0).toUpperCase() + selectedFramework.slice(1)} Project
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {pages.map((page, index) => {
                      const elementCounts = getElementCounts(page.elements)
                      return (
                        <AccordionItem key={index} value={`page-${index}`} className="border-zinc-800">
                          <AccordionTrigger className="hover:no-underline py-4 text-zinc-200 hover:text-purple-400">
                            <div className="flex items-center">
                              <FileCode className="h-4 w-4 mr-2 text-purple-500" />
                              <span className="font-medium">{page.title || page.path}</span>
                              <Badge variant="outline" className="ml-2 bg-zinc-800/50 text-purple-400 border-zinc-700">
                                {page.elements?.length || 0} elements
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="space-y-4 text-zinc-300">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <div className="text-sm">
                                    <span className="font-medium text-zinc-200">URL:</span>
                                    <span className="ml-1 text-zinc-400 break-all">{page.url}</span>
                                  </div>
                                  {page.title && (
                                    <div className="text-sm">
                                      <span className="font-medium text-zinc-200">Title:</span>
                                      <span className="ml-1 text-zinc-400">{page.title}</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-zinc-200 mb-2">Element Types:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(elementCounts).map(([type, count]) => (
                                      <Badge
                                        key={type}
                                        variant="secondary"
                                        className="bg-zinc-800 text-purple-300 hover:bg-zinc-700"
                                      >
                                        {type}: {count}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <Separator className="bg-zinc-800" />

                              <div>
                                <h4 className="text-sm font-medium text-zinc-200 mb-3">Interactive Elements:</h4>
                                <div className="border rounded-md p-3 bg-zinc-950/50 border-zinc-800 max-h-[250px] overflow-y-auto">
                                  <ul className="space-y-2 text-sm">
                                    {page.elements?.map((element: any, elemIndex: number) => (
                                      <li
                                        key={elemIndex}
                                        className="flex items-start p-2 hover:bg-zinc-900/50 rounded-sm transition-colors"
                                      >
                                        <Badge className="mr-2 mt-0.5 bg-zinc-800 text-purple-300" variant="secondary">
                                          {element.type}
                                        </Badge>
                                        <div className="flex-1 overflow-hidden">
                                          <div className="truncate text-zinc-300">
                                            {element.text || element.name || element.id || element.selector || "-"}
                                          </div>
                                          <div className="text-xs text-zinc-500 truncate mt-1">{element.selector}</div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 bg-zinc-900/50 flex justify-between">
                  <div className="text-xs text-zinc-400">
                    Test files will be organized by page in the {selectedFramework} project
                  </div>
                  <Button
                    onClick={downloadProject}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="text-purple-400 border-purple-900 hover:bg-purple-900/20"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download {selectedFramework.charAt(0).toUpperCase() + selectedFramework.slice(1)} Project
                  </Button>
                </CardFooter>
              </Card>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800 text-red-300">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-zinc-900 bg-black py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Code className="h-5 w-5 text-purple-500" />
            <span className="text-lg font-semibold text-zinc-200">ElementForge AI</span>
          </div>
          <p className="text-sm text-zinc-400">
            Next-gen AI tool for mapping interactive elements and generating test projects
          </p>
          <div className="mt-4 text-xs text-zinc-600">
            © {new Date().getFullYear()} ElementForge AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        onSuccess={handleUpgradePlan}
        currentPlan={currentPlan}
      />
    </div>
  )
}

// Helper component for the CheckCircle icon
function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
