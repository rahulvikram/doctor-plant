"use client"

import { Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <><SignedIn>
      <SidebarProvider>
        <div className="flex min-h-screen bg-[#f8faf5]">
          <SidebarInset className="p-6">
            <div className="space-y-6">
              <DashboardHeader />
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                  <QuickActions />
                </TabsContent>
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics</CardTitle>
                      <CardDescription>View detailed analytics about your plant health data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Analytics charts and data will appear here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reports" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reports</CardTitle>
                      <CardDescription>Access and download your plant health reports.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Reports will appear here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Manage your notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Notification settings will appear here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SignedIn>
    <SignedOut>
      <div className="max-w-4xl mx-auto text-white">Sign in to view your dashboard</div>
    </SignedOut></>
  )
}

function DashboardHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-green-900">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Garden Enthusiast!</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-1">
          <Upload className="h-4 w-4" />
          <Link href="/diagnose">
            <span>Upload</span>
          </Link>
        </Button>
        <Button className="gap-1 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          <span>New Scan</span>
        </Button>
      </div>
    </div>
  )
}

function QuickActions() {
  const router = useRouter();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="bg-green-50 border-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Scan Plant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">Quick Diagnosis</div>
          <p className="text-xs text-muted-foreground">Upload a photo for instant analysis</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push("/diagnose")}>
            Start Scan
          </Button>
        </CardFooter>
      </Card>
      <Card className="bg-teal-50 border-teal-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-teal-800">Plant Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Your personal plant collection</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" className="w-full border-teal-200 text-teal-700" onClick={() => router.push("/library")}>
            Browse Library
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}