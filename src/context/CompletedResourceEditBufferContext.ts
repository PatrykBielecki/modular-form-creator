import { createContext } from 'react'
import type { BasicInfo, ProjectDetails, Resource } from '../types/resource'
import type { ResourceEditBuffer } from '../types/resourceEditBuffer'

export interface CompletedResourceEditBufferContextValue {
  getBuffer: (resourceId: string) => ResourceEditBuffer | undefined
  getBufferRevision: (resourceId: string) => number
  hasBufferedChanges: (resource: Resource) => boolean
  setBasicInfoBuffer: (resourceId: string, basicInfo: BasicInfo) => void
  setProjectDetailsBuffer: (
    resourceId: string,
    projectDetails: ProjectDetails,
  ) => void
  clearBuffer: (resourceId: string) => void
}

export const CompletedResourceEditBufferContext =
  createContext<CompletedResourceEditBufferContextValue | null>(null)
