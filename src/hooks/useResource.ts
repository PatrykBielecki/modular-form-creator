import { useEffect, useState } from 'react'
import { ApiError, getErrorMessage } from '../api/errors'
import { getResource } from '../api/resources'
import type { Resource } from '../types/resource'

interface ResourceFetchError {
  resourceId: string
  message: string
  status?: number
}

export function useResource(resourceId: string) {
  const [resource, setResource] = useState<Resource | null>(null)
  const [fetchError, setFetchError] = useState<ResourceFetchError | null>(null)

  const isCurrentResource =
    resource !== null && String(resource.resourceId) === resourceId
  const loadError =
    fetchError?.resourceId === resourceId ? fetchError.message : null
  const isNotFound =
    fetchError?.resourceId === resourceId && fetchError.status === 404
  const loading = !isCurrentResource && loadError === null

  useEffect(() => {
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
  }, [resourceId])

  return {
    resource: isCurrentResource ? resource : null,
    loading,
    loadError,
    isNotFound,
    setResource,
  }
}
