import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { CrewDetailPage } from '@/pages/CrewDetailPage'
import { SkillDetailPage } from '@/pages/SkillDetailPage'
import { DiceDetailPage } from '@/pages/DiceDetailPage'
import { EquipmentDetailPage } from '@/pages/EquipmentDetailPage'
import { GuidePage } from '@/pages/GuidePage'
import { GlossaryPage } from '@/pages/GlossaryPage'
import { SymptomDetailPage } from '@/pages/SymptomDetailPage'
import { RecruitmentSimulatorPage } from '@/pages/RecruitmentSimulatorPage'
import { CollectionPage } from '@/pages/CollectionPage'
import { FigureheadPrayerPage } from '@/pages/FigureheadPrayerPage'
import { FigureheadPrayerRecommendPage } from '@/pages/FigureheadPrayerRecommendPage'
import { RandomAffixListPage } from '@/pages/RandomAffixListPage'
import { RandomAffixDetailPage } from '@/pages/RandomAffixDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'crews', element: <CategoryPage category="crews" /> },
      { path: 'crews/:slug', element: <CrewDetailPage /> },
      { path: 'figurehead-prayer', element: <FigureheadPrayerPage /> },
      { path: 'figurehead-prayer/recommend', element: <FigureheadPrayerRecommendPage /> },
      { path: 'crews/figurehead-prayer', element: <Navigate to="/figurehead-prayer" replace /> },
      { path: 'crews/figurehead-prayer/recommend', element: <Navigate to="/figurehead-prayer/recommend" replace /> },
      { path: 'ships', element: <CategoryPage category="ships" /> },
      { path: 'ships/:slug', element: <NotFoundPage /> },
      { path: 'classes', element: <CategoryPage category="classes" /> },
      { path: 'classes/:slug', element: <NotFoundPage /> },
      { path: 'skills', element: <CategoryPage category="skills" /> },
      { path: 'skills/:slug', element: <SkillDetailPage /> },
      { path: 'dice', element: <CategoryPage category="dice" /> },
      { path: 'dice/:slug', element: <DiceDetailPage /> },
      { path: 'songs', element: <CategoryPage category="songs" /> },
      { path: 'songs/:slug', element: <NotFoundPage /> },
      { path: 'equipment', element: <CategoryPage category="equipment" /> },
      { path: 'equipment/:slug', element: <EquipmentDetailPage /> },
      { path: 'random-affixes', element: <RandomAffixListPage /> },
      { path: 'random-affixes/:slug', element: <RandomAffixDetailPage /> },
      { path: 'items', element: <CategoryPage category="items" /> },
      { path: 'items/:slug', element: <NotFoundPage /> },
      { path: 'quests', element: <CategoryPage category="quests" /> },
      { path: 'quests/:slug', element: <NotFoundPage /> },
      { path: 'locations', element: <CategoryPage category="locations" /> },
      { path: 'locations/:slug', element: <NotFoundPage /> },
      { path: 'symptoms', element: <CategoryPage category="symptoms" /> },
      { path: 'symptoms/:slug', element: <SymptomDetailPage /> },
      { path: 'recruitment', element: <RecruitmentSimulatorPage /> },
      { path: 'recruitment/collection', element: <CollectionPage /> },
      { path: 'guides/:slug', element: <GuidePage /> },
      { path: 'glossary', element: <GlossaryPage /> },
      { path: 'search', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
