"use client"

import { Bell, Calendar, Home, Leaf, PieChart, Plus, Settings, Upload, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from "@/components/ui/sidebar"

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
                  <RecentUploads />
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
          <div className="text-2xl font-bold text-teal-900">24 Plants</div>
          <p className="text-xs text-muted-foreground">Your personal plant collection</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" className="w-full border-teal-200 text-teal-700">
            Browse Library
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function UploadStatsCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upload Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Month</p>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">142</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Storage Used</p>
          <Progress value={35} className="h-2 bg-gray-100 [&>div]:bg-green-500" />
          <p className="text-xs text-muted-foreground">350MB of 1GB</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full text-green-700">
          Manage Storage
        </Button>
      </CardFooter>
    </Card>
  )
}

function RegionalAlertsCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Regional Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-amber-50 p-3 border border-amber-100">
          <div className="flex items-start gap-2">
            <Bell className="h-4 w-4 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Powdery Mildew Alert</p>
              <p className="text-xs text-amber-700">
                High humidity levels in your region may increase risk of powdery mildew.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-md bg-blue-50 p-3 border border-blue-100">
          <div className="flex items-start gap-2">
            <Bell className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Frost Warning</p>
              <p className="text-xs text-blue-700">
                Temperatures expected to drop below freezing tonight. Protect sensitive plants.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full text-green-700">
          View All Alerts
        </Button>
      </CardFooter>
    </Card>
  )
}

function RecentUploads() {
  const recentUploads: any[] = []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Uploads</CardTitle>
          <Button variant="ghost" size="sm" className="text-green-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentUploads.map((upload) => (
            <div key={upload.id} className="rounded-lg border bg-card overflow-hidden">
              <div className="relative h-32 w-full">
                <img
                  src={upload.image || "/placeholder.svg"}
                  alt={upload.name}
                  className="h-full w-full object-cover"
                />
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    upload.status === "Healthy"
                      ? "bg-green-100 text-green-800"
                      : upload.status === "Needs Water"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {upload.status}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium">{upload.name}</h3>
                <p className="text-xs text-muted-foreground">{upload.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

