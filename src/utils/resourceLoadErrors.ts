import { INVALID_RESOURCE_ID_MESSAGE } from './resourceRouteId'

interface ResourceFetchErrorLike {
  resourceId: string
  message: string
  status?: number
}

import type { BasicInfo } from '../types/resource'

export function getResourceLoadErrorTitle(
  error: ResourceFetchErrorLike | null,
  resourceId: string,
): string {
  if (!error || error.resourceId !== resourceId) {
    return 'Could not load resource'
  }

  if (error.status === 404) {
    return 'Resource not found'
  }

  if (error.status === 400) {
    return error.message === INVALID_RESOURCE_ID_MESSAGE
      ? 'Invalid resource id'
      : 'Request failed'
  }

  return 'Could not load resource'
}

export function ensureLockedResourceName(
  formValues: BasicInfo,
  serverResourceName: string,
): BasicInfo {
  return {
    ...formValues,
    resourceName: serverResourceName,
  }
}

export function assertResourceNameUnchanged(
  nextResourceName: string,
  serverResourceName: string,
): string | undefined {
  if (nextResourceName.trim() !== serverResourceName.trim()) {
    return 'resourceName is locked after creation and cannot be changed'
  }

  return undefined
}
