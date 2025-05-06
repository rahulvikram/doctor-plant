import { Upload } from "@/components/upload"
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FFF8] to-[#EDFBF0]">
      <SignedIn>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#4CAF50] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-leaf"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#2E7D32]">LeafLens.ai</h1>
          </div>
          <p className="mt-2 text-[#558B59] max-w-2xl">
            The fastest way to detect, diagnose, and treat plant diseases.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-[#D8EFD9] overflow-hidden">
            <div className="p-6 border-b border-[#E8F5E9]">
              <h2 className="text-xl font-semibold text-[#2E7D32]">Upload Plant Images</h2>
              <p className="text-[#558B59] mt-1">
                Upload images of your plants to diagnose potential diseases and get treatment recommendations.
              </p>
            </div>
            <div className="p-6">
              <Upload />
            </div>
          </div>
        </div>
      </div>
      </SignedIn>
      <SignedOut>
        <div className="max-w-4xl mx-auto text-black">Sign in to upload plant images</div>
      </SignedOut>
    </main>
  )
}
