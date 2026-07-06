import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { BasicInfoPage } from '../pages/BasicInfoPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage'
import { ResourceDetailsPage } from '../pages/ResourceDetailsPage'
import { ResourceOverviewPage } from '../pages/ResourceOverviewPage'
import { ResourcesListPage } from '../pages/ResourcesListPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/resources" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/resources" element={<ResourcesListPage />} />
        <Route
          path="/resources/:resourceId/details"
          element={<ResourceDetailsPage />}
        />
        <Route
          path="/resources/:resourceId/basic-info"
          element={<BasicInfoPage />}
        />
        <Route
          path="/resources/:resourceId/project-details"
          element={<ProjectDetailsPage />}
        />
        <Route path="/resources/:resourceId" element={<ResourceOverviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
