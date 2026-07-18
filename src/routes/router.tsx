import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { CrewDetailPage } from '@/pages/CrewDetailPage'
import { SkillDetailPage } from '@/pages/SkillDetailPage'
import { EquipmentDetailPage } from '@/pages/EquipmentDetailPage'
import { GuidePage } from '@/pages/GuidePage'
import { GlossaryPage } from '@/pages/GlossaryPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'crews', element: <CategoryPage category="crews" /> },
      { path: 'crews/:slug', element: <CrewDetailPage /> },
      { path: 'ships', element: <CategoryPage category="ships" /> },
      { path: 'ships/:slug', element: <NotFoundPage /> },
      { path: 'classes', element: <CategoryPage category="classes" /> },
      { path: 'classes/:slug', element: <NotFoundPage /> },
      { path: 'skills', element: <CategoryPage category="skills" /> },
      { path: 'skills/:slug', element: <SkillDetailPage /> },
      { path: 'dice', element: <CategoryPage category="dice" /> },
      { path: 'dice/:slug', element: <SkillDetailPage type="dice" /> },
      { path: 'songs', element: <CategoryPage category="songs" /> },
      { path: 'songs/:slug', element: <NotFoundPage /> },
      { path: 'equipment', element: <CategoryPage category="equipment" /> },
      { path: 'equipment/:slug', element: <EquipmentDetailPage /> },
      { path: 'items', element: <CategoryPage category="items" /> },
      { path: 'items/:slug', element: <NotFoundPage /> },
      { path: 'quests', element: <CategoryPage category="quests" /> },
      { path: 'quests/:slug', element: <NotFoundPage /> },
      { path: 'locations', element: <CategoryPage category="locations" /> },
      { path: 'locations/:slug', element: <NotFoundPage /> },
      { path: 'guides/:slug', element: <GuidePage /> },
      { path: 'glossary', element: <GlossaryPage /> },
      { path: 'search', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
