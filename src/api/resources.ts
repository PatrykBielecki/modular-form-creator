import { apiRequest } from './client'
import type {
  CreateResourceRequest,
  FullResourceUpdateRequest,
  GetResourcesParams,
  Resource,
  ResourceId,
  ResourceListResponse,
  UpdateBasicInfoRequest,
  UpdateProjectDetailsRequest,
} from '../types/resource'

const RESOURCES_PATH = '/api/resources'

function toResourcePath(resourceId: ResourceId): string {
  return `${RESOURCES_PATH}/${encodeURIComponent(String(resourceId))}`
}

function toQueryString(params: GetResourcesParams): string {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page))
  }
  if (params.pageSize !== undefined) {
    searchParams.set('pageSize', String(params.pageSize))
  }
  if (params.status !== undefined) {
    searchParams.set('status', params.status)
  }
  if (params.name !== undefined && params.name.trim() !== '') {
    searchParams.set('name', params.name.trim())
  }
  if (params.sortOrder !== undefined) {
    searchParams.set('sortOrder', params.sortOrder)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function getResources(
  params: GetResourcesParams = {},
): Promise<ResourceListResponse> {
  return apiRequest<ResourceListResponse>(
    `${RESOURCES_PATH}${toQueryString(params)}`,
  )
}

export function getResource(resourceId: ResourceId): Promise<Resource> {
  return apiRequest<Resource>(toResourcePath(resourceId))
}

export function createResource(resourceName: string): Promise<Resource> {
  const body: CreateResourceRequest = { resourceName }
  return apiRequest<Resource>(RESOURCES_PATH, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function deleteResource(resourceId: ResourceId): Promise<Resource> {
  return apiRequest<Resource>(toResourcePath(resourceId), {
    method: 'DELETE',
  })
}

export function updateBasicInfo(
  resourceId: ResourceId,
  payload: UpdateBasicInfoRequest,
): Promise<Resource> {
  return apiRequest<Resource>(`${toResourcePath(resourceId)}/basic-info`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function updateProjectDetails(
  resourceId: ResourceId,
  payload: UpdateProjectDetailsRequest,
): Promise<Resource> {
  return apiRequest<Resource>(
    `${toResourcePath(resourceId)}/project-details`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  )
}

export function provisionResource(resourceId: ResourceId): Promise<Resource> {
  return apiRequest<Resource>(`${toResourcePath(resourceId)}/provisioning`, {
    method: 'PATCH',
  })
}

export function updateCompletedResource(
  resourceId: ResourceId,
  fullPayload: FullResourceUpdateRequest,
): Promise<Resource> {
  return apiRequest<Resource>(toResourcePath(resourceId), {
    method: 'PUT',
    body: JSON.stringify(fullPayload),
  })
}
