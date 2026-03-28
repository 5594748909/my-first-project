import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { GamePage } from '../pages/GamePage'
import { ResultPage } from '../pages/ResultPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'game/:id',
        element: <GamePage />,
      },
      {
        path: 'result/:id',
        element: <ResultPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
