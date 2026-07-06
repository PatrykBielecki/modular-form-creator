import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ApiError, getErrorMessage } from '../api/errors'
import { getResource } from '../api/resources'
import type { Resource } from '../types/resource'
import { getResourceLoadErrorTitle } from '../utils/resourceLoadErrors'
import {
  INVALID_RESOURCE_ID_MESSAGE,
  isValidResourceRouteId,
} from '../utils/resourceRouteId'

interface ResourceFetchError {
  resourceId: string
  message: string
  status?: number
}

export function useResource(resourceId: string) {
  const location = useLocation()
  const isRouteIdValid = isValidResourceRouteId(resourceId)
  const [resource, setResource] = useState<Resource | null>(null)
  const [fetchError, setFetchError] = useState<ResourceFetchError | null>(null)

  const invalidIdError: ResourceFetchError | null = isRouteIdValid
    ? null
    : {
        resourceId,
        message: INVALID_RESOURCE_ID_MESSAGE,
        status: 400,
      }

  const activeError =
    invalidIdError ??
    (fetchError?.resourceId === resourceId ? fetchError : null)

  const isCurrentResource =
    isRouteIdValid &&
    resource !== null &&
    String(resource.resourceId) === resourceId
  const loadError = activeError?.message ?? null
  const isNotFound = activeError?.status === 404
  const isInvalidId =
    activeError?.status === 400 ||
    activeError?.message === INVALID_RESOURCE_ID_MESSAGE
  const loadErrorTitle = getResourceLoadErrorTitle(activeError, resourceId)
  const loading = isRouteIdValid && !isCurrentResource && loadError === null

  useEffect(() => {
    if (!isRouteIdValid) {
      return undefined
    }

    let cancelled = false

    getResource(resourceId)
      .then((loadedResource) => {
        if (!cancelled) {
          setResource(loadedResource)
          setFetchError(null)
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setFetchError({
            resourceId,
            message: getErrorMessage(error),
            status: error instanceof ApiError ? error.status : undefined,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [resourceId, location.key, isRouteIdValid])

  return {
    resource: isCurrentResource ? resource : null,
    loading,
    loadError,
    loadErrorTitle,
    isNotFound,
    isInvalidId,
    setResource,
  }
}
