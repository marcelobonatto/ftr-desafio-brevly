import { RouterProvider } from "react-router"
import { router } from "@/routes"
import { Toaster } from 'sonner'

export function App() {
  return (
    <>
      <Toaster richColors />
      <main className="flex justify-center items-center min-h-dvh w-full bg-gray-200 p-4">
        <RouterProvider router={router} />
      </main>
    </>
  )
}
