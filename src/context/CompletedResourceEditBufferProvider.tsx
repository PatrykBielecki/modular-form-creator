import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BasicInfo, ProjectDetails } from '../types/resource'
import type { ResourceEditBuffer } from '../types/resourceEditBuffer'
import { CompletedResourceEditBufferContext } from './CompletedResourceEditBufferContext'

export function CompletedResourceEditBufferProvider({
  children,
}: {
  children: ReactNode
}) {
  const [buffers, setBuffers] = useState<Record<string, ResourceEditBuffer>>({})
  const [revisions, setRevisions] = useState<Record<string, number>>({})

  const bumpRevision = useCallback((resourceId: string) => {
    setRevisions((current) => ({
      ...current,
      [resourceId]: (current[resourceId] ?? 0) + 1,
    }))
  }, [])

  const getBuffer = useCallback(
    (resourceId: string) => buffers[resourceId],
    [buffers],
  )

  const getBufferRevision = useCallback(
    (resourceId: string) => revisions[resourceId] ?? 0,
    [revisions],
  )

  const setBasicInfoBuffer = useCallback(
    (resourceId: string, basicInfo: BasicInfo) => {
      setBuffers((current) => ({
        ...current,
        [resourceId]: {
          ...current[resourceId],
          basicInfo,
        },
      }))
    },
    [],
  )

  const setProjectDetailsBuffer = useCallback(
    (resourceId: string, projectDetails: ProjectDetails) => {
      setBuffers((current) => ({
        ...current,
        [resourceId]: {
          ...current[resourceId],
          projectDetails,
        },
      }))
    },
    [],
  )

  const clearBuffer = useCallback(
    (resourceId: string) => {
      setBuffers((current) => {
        const next = { ...current }
        delete next[resourceId]
        return next
      })
      bumpRevision(resourceId)
    },
    [bumpRevision],
  )

  const value = useMemo(
    () => ({
      getBuffer,
      getBufferRevision,
      setBasicInfoBuffer,
      setProjectDetailsBuffer,
      clearBuffer,
    }),
    [
      getBuffer,
      getBufferRevision,
      setBasicInfoBuffer,
      setProjectDetailsBuffer,
      clearBuffer,
    ],
  )

  return (
    <CompletedResourceEditBufferContext.Provider value={value}>
      {children}
    </CompletedResourceEditBufferContext.Provider>
  )
}
