export type ResourceStatus = 'draft' | 'completed'

export interface BasicInfo {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: string
}

export interface ProjectDetails {
  projectName: string
  budget: string
  category: string
  options: string[]
}

export interface Resource {
  _id: string
  resourceId: number
  name: string
  status: ResourceStatus
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
  createdAt?: string
  updatedAt?: string
}

export interface CreateResourceRequest {
  resourceName: string
}

export type UpdateBasicInfoRequest = BasicInfo

export type UpdateProjectDetailsRequest = ProjectDetails

export interface FullResourceUpdateRequest {
  name: string
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
}

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ResourceListResponse {
  items: Resource[]
  pagination: Pagination
}

export interface GetResourcesParams {
  page?: number
  pageSize?: number
  status?: ResourceStatus
  name?: string
  sortOrder?: 'asc' | 'desc'
}

/** Numeric resourceId or Mongo ObjectId accepted by the backend. */
export type ResourceId = number | string
