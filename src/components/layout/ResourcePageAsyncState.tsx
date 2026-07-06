import type { ReactNode } from 'react'
import { AsyncState } from './AsyncState'
import { ResourceLoadErrorActions } from './ResourceLoadErrorActions'

interface ResourcePageAsyncStateProps {
  loading: boolean
  loadError: string | null
  loadErrorTitle: string
  isNotFound: boolean
  isInvalidId: boolean
  loadingMessage: string
  children: ReactNode
}

export function ResourcePageAsyncState({
  loading,
  loadError,
  loadErrorTitle,
  isNotFound,
  isInvalidId,
  loadingMessage,
  children,
}: ResourcePageAsyncStateProps) {
  return (
    <AsyncState
      loading={loading}
      error={loadError}
      loadingMessage={loadingMessage}
      errorTitle={loadErrorTitle}
      errorAction={
        loadError ? (
          <ResourceLoadErrorActions
            variant={
              isNotFound
                ? 'not-found'
                : isInvalidId
                  ? 'invalid-id'
                  : 'generic'
            }
          />
        ) : null
      }
    >
      {children}
    </AsyncState>
  )
}
