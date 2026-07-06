import type { BasicInfo, ProjectDetails, Resource } from '../types/resource'

function hasValue(value: string): boolean {
  return Boolean(value)
}

export function isBasicInfoComplete(basicInfo: BasicInfo): boolean {
  return Boolean(
    hasValue(basicInfo.resourceName) &&
      hasValue(basicInfo.owner) &&
      hasValue(basicInfo.email) &&
      hasValue(basicInfo.description) &&
      hasValue(basicInfo.priority),
  )
}

export function isProjectDetailsComplete(
  projectDetails: ProjectDetails,
): boolean {
  return Boolean(
    hasValue(projectDetails.projectName) &&
      hasValue(projectDetails.budget) &&
      hasValue(projectDetails.category) &&
      projectDetails.options.length > 0,
  )
}

export function isReadyForProvisioning(
  resource: Pick<Resource, 'status' | 'basicInfo' | 'projectDetails'>,
): boolean {
  return (
    resource.status === 'draft' &&
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  )
}

export function canEditProjectDetails(basicInfo: BasicInfo): boolean {
  return isBasicInfoComplete(basicInfo)
}

export function getCompletedModuleCount(
  resource: Pick<Resource, 'basicInfo' | 'projectDetails'>,
): number {
  let count = 0
  if (isBasicInfoComplete(resource.basicInfo)) {
    count += 1
  }
  if (isProjectDetailsComplete(resource.projectDetails)) {
    count += 1
  }
  return count
}

export function getProvisioningBlockedReason(
  resource: Pick<Resource, 'status' | 'basicInfo' | 'projectDetails'>,
): string | null {
  if (resource.status === 'completed' || isReadyForProvisioning(resource)) {
    return null
  }

  const missingModules: string[] = []
  if (!isBasicInfoComplete(resource.basicInfo)) {
    missingModules.push('Basic Info')
  }
  if (!isProjectDetailsComplete(resource.projectDetails)) {
    missingModules.push('Project Details')
  }

  return `Complete ${missingModules.join(' and ')} before provisioning.`
}
