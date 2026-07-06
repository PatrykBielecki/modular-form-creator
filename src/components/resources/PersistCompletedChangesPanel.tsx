import { useState } from 'react'
import styled from 'styled-components'
import { getErrorMessage } from '../../api/errors'
import { updateCompletedResource } from '../../api/resources'
import { useCompletedResourceEditBuffer } from '../../hooks/useCompletedResourceEditBuffer'
import { Button } from '../../design-system'
import type { Resource } from '../../types/resource'
import {
  buildFullResourceUpdatePayload,
  hasBufferedChanges,
} from '../../utils/mergeResource'
import {
  hasValidationErrors,
  validateBasicInfo,
  validateProjectDetails,
} from '../../utils/validation'

interface PersistCompletedChangesPanelProps {
  serverResource: Resource
  resourceId: string
  onPersisted: (resource: Resource) => void
}

export function PersistCompletedChangesPanel({
  serverResource,
  resourceId,
  onPersisted,
}: PersistCompletedChangesPanelProps) {
  const { getBuffer, clearBuffer } = useCompletedResourceEditBuffer()
  const buffer = getBuffer(resourceId)

  const [isPersisting, setIsPersisting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (
    serverResource.status !== 'completed' ||
    !hasBufferedChanges(serverResource, buffer)
  ) {
    return null
  }

  const handlePersist = () => {
    const payload = buildFullResourceUpdatePayload(serverResource, buffer)
    const basicInfoErrors = validateBasicInfo(payload.basicInfo)
    const projectDetailsErrors = validateProjectDetails(payload.projectDetails)

    if (
      hasValidationErrors(basicInfoErrors) ||
      hasValidationErrors(projectDetailsErrors)
    ) {
      setSuccess(null)
      setError(
        'Buffered changes are incomplete or invalid. Review both modules before persisting.',
      )
      return
    }

    const confirmed = window.confirm(
      `Persist all temporary changes for "${serverResource.name}" (#${serverResource.resourceId}) to the server? This sends a full update and cannot be undone from here.`,
    )

    if (!confirmed) {
      return
    }

    setIsPersisting(true)
    setError(null)
    setSuccess(null)

    updateCompletedResource(resourceId, payload)
      .then((updatedResource) => {
        clearBuffer(resourceId)
        onPersisted(updatedResource)
        setSuccess('All changes were persisted successfully.')
      })
      .catch((persistError: unknown) => {
        setError(getErrorMessage(persistError))
      })
      .finally(() => {
        setIsPersisting(false)
      })
  }

  return (
    <Panel>
      <Title>Persist completed resource changes</Title>
      <Message>
        Temporary edits from one or both modules will be sent to the server as a
        single full update. This is the only way to persist changes for
        completed resources.
      </Message>
      <Button type="button" onClick={handlePersist} disabled={isPersisting}>
        {isPersisting ? 'Persisting…' : 'Persist changes to server'}
      </Button>
      {error ? <Feedback $variant="error">{error}</Feedback> : null}
      {success ? <Feedback $variant="success">{success}</Feedback> : null}
    </Panel>
  )
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 640px;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.95rem;
`

const Feedback = styled.p<{ $variant: 'error' | 'success' }>`
  margin: 0;
  color: ${({ theme, $variant }) =>
    $variant === 'success' ? theme.colors.success : theme.colors.warning};
  font-size: 0.95rem;
`
