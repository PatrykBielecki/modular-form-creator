import { useParams } from 'react-router-dom'

export function useResourceId(): string {
  const { resourceId } = useParams<{ resourceId: string }>()

  if (!resourceId) {
    throw new Error('resourceId route param is required')
  }

  return resourceId
}

export function resourceOverviewPath(resourceId: string): string {
  return `/resources/${resourceId}`
}

export function resourceDetailsPath(resourceId: string): string {
  return `/resources/${resourceId}/details`
}

export function resourceBasicInfoPath(resourceId: string): string {
  return `/resources/${resourceId}/basic-info`
}

export function resourceProjectDetailsPath(resourceId: string): string {
  return `/resources/${resourceId}/project-details`
}
