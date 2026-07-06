import type {
  BasicInfo,
  FullResourceUpdateRequest,
  ProjectDetails,
  Resource,
} from '../types/resource'
import type { ResourceEditBuffer } from '../types/resourceEditBuffer'

function basicInfoEquals(left: BasicInfo, right: BasicInfo): boolean {
  return (
    left.resourceName === right.resourceName &&
    left.owner === right.owner &&
    left.email === right.email &&
    left.description === right.description &&
    left.priority === right.priority
  )
}

function optionsEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false
  }

  return left.every((value, index) => value === right[index])
}

function projectDetailsEquals(
  left: ProjectDetails,
  right: ProjectDetails,
): boolean {
  return (
    left.projectName === right.projectName &&
    left.budget === right.budget &&
    left.category === right.category &&
    optionsEqual(left.options, right.options)
  )
}

/** Merge server resource data with in-memory buffered module edits. */
export function mergeResourceWithBuffer(
  resource: Resource,
  buffer?: ResourceEditBuffer,
): Resource {
  if (!buffer) {
    return resource
  }

  return {
    ...resource,
    basicInfo: buffer.basicInfo ?? resource.basicInfo,
    projectDetails: buffer.projectDetails ?? resource.projectDetails,
  }
}

/** Whether buffered edits differ from the persisted server resource. */
export function hasBufferedChanges(
  resource: Resource,
  buffer?: ResourceEditBuffer,
): boolean {
  if (!buffer) {
    return false
  }

  if (
    buffer.basicInfo &&
    !basicInfoEquals(buffer.basicInfo, resource.basicInfo)
  ) {
    return true
  }

  if (
    buffer.projectDetails &&
    !projectDetailsEquals(buffer.projectDetails, resource.projectDetails)
  ) {
    return true
  }

  return false
}

/** Build the full PUT payload from server data merged with buffered edits. */
export function buildFullResourceUpdatePayload(
  resource: Resource,
  buffer?: ResourceEditBuffer,
): FullResourceUpdateRequest {
  const merged = mergeResourceWithBuffer(resource, buffer)

  return {
    name: resource.name,
    basicInfo: {
      ...merged.basicInfo,
      resourceName: resource.basicInfo.resourceName,
    },
    projectDetails: merged.projectDetails,
  }
}

/** Resource view used for editing/display when temporary changes may exist. */
export function getResourceEditView(
  resource: Resource,
  buffer?: ResourceEditBuffer,
): Resource {
  return mergeResourceWithBuffer(resource, buffer)
}
