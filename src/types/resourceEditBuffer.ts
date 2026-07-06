import type { BasicInfo, ProjectDetails } from './resource'

/** In-memory temporary edits for a completed resource, keyed by resourceId. */
export interface ResourceEditBuffer {
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
}
