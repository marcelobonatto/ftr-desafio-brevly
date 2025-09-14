import { createBrowserRouter } from 'react-router'
import { MainPage } from '@/pages/MainPage'
import { RedirPage } from '@/pages/RedirPage'

export const router = createBrowserRouter([
    { path: "/", Component: MainPage },
    { path: "/:short", Component: RedirPage }
])