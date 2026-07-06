import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getErrorMessage } from '../api/errors'
import { updateBasicInfo } from '../api/resources'
import { BasicInfoForm } from '../components/forms/BasicInfoForm'
import { BufferedChangesNotice } from '../components/resources/BufferedChangesNotice'
import { PersistCompletedChangesPanel } from '../components/resources/PersistCompletedChangesPanel'
import { PageHeader } from '../components/layout/PageHeader'
import { ResourcePageAsyncState } from '../components/layout/ResourcePageAsyncState'
import { useCompletedResourceEditBuffer } from '../hooks/useCompletedResourceEditBuffer'
import { useResource } from '../hooks/useResource'
import { resourceOverviewPath, useResourceId } from '../hooks/useResourceId'
import type { BasicInfo, Resource } from '../types/resource'
import { getResourceEditView, hasBufferedChanges } from '../utils/mergeResource'
import {
  assertResourceNameUnchanged,
  ensureLockedResourceName,
} from '../utils/resourceLoadErrors'
import {
  hasValidationErrors,
  validateBasicInfo,
  type BasicInfoFieldErrors,
} from '../utils/validation'

interface BasicInfoPageContentProps {
  resource: Resource
  resourceId: string
  onResourceUpdated: (resource: Resource) => void
}

function BasicInfoPageContent({
  resource,
  resourceId,
  onResourceUpdated,
}: BasicInfoPageContentProps) {
  const navigate = useNavigate()
  const { getBuffer, setBasicInfoBuffer } = useCompletedResourceEditBuffer()
  const buffer = getBuffer(resourceId)
  const editView = getResourceEditView(resource, buffer)
  const isCompleted = resource.status === 'completed'
  const lockedResourceName = resource.basicInfo.resourceName

  const [formValues, setFormValues] = useState<BasicInfo>(editView.basicInfo)
  const [fieldErrors, setFieldErrors] = useState<BasicInfoFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showBufferedNotice =
    isCompleted && hasBufferedChanges(resource, getBuffer(resourceId))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    const payload = ensureLockedResourceName(formValues, lockedResourceName)
    const resourceNameError = assertResourceNameUnchanged(
      payload.resourceName,
      lockedResourceName,
    )
    const errors = validateBasicInfo(payload)

    if (resourceNameError) {
      errors.resourceName = resourceNameError
    }

    if (hasValidationErrors(errors)) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    if (isCompleted) {
      setBasicInfoBuffer(resourceId, payload)
      setSubmitSuccess(
        'Temporary Basic Info changes saved in memory. Persist them with a full update when ready.',
      )
      return
    }

    setIsSubmitting(true)

    updateBasicInfo(resourceId, payload)
      .then((updatedResource) => {
        onResourceUpdated(updatedResource)
        navigate(resourceOverviewPath(resourceId))
      })
      .catch((error: unknown) => {
        setSubmitError(getErrorMessage(error))
        setIsSubmitting(false)
      })
  }

  const handleChange = (nextValue: BasicInfo) => {
    setFormValues(ensureLockedResourceName(nextValue, lockedResourceName))
    setFieldErrors((current) => {
      const nextErrors = { ...current }
      for (const key of Object.keys(nextValue) as (keyof BasicInfo)[]) {
        if (nextValue[key] !== formValues[key]) {
          delete nextErrors[key]
        }
      }
      return nextErrors
    })
    if (submitError) {
      setSubmitError(null)
    }
    if (submitSuccess) {
      setSubmitSuccess(null)
    }
  }

  return (
    <FormStack>
      {showBufferedNotice ? <BufferedChangesNotice /> : null}
      <BasicInfoForm
        mode={isCompleted ? 'completed' : 'draft'}
        value={formValues}
        fieldErrors={fieldErrors}
        submitError={submitError}
        submitSuccess={submitSuccess}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      {isCompleted ? (
        <PersistCompletedChangesPanel
          serverResource={resource}
          resourceId={resourceId}
          onPersisted={onResourceUpdated}
        />
      ) : null}
    </FormStack>
  )
}

export function BasicInfoPage() {
  const resourceId = useResourceId()
  const {
    resource,
    loading,
    loadError,
    loadErrorTitle,
    isNotFound,
    isInvalidId,
    setResource,
  } = useResource(resourceId)
  const { getBufferRevision } = useCompletedResourceEditBuffer()
  const bufferRevision = getBufferRevision(resourceId)

  return (
    <section>
      <PageHeader
        title="Basic Info"
        description={
          resource
            ? `${resource.name} · Resource #${resource.resourceId}`
            : `Resource #${resourceId}`
        }
        backTo={resourceOverviewPath(resourceId)}
        backLabel="Back to overview"
      />

      <ResourcePageAsyncState
        loading={loading}
        loadError={loadError}
        loadErrorTitle={loadErrorTitle}
        isNotFound={isNotFound}
        isInvalidId={isInvalidId}
        loadingMessage="Loading Basic Info…"
      >
        {resource ? (
          <BasicInfoPageContent
            key={`${resource._id}-${bufferRevision}`}
            resource={resource}
            resourceId={resourceId}
            onResourceUpdated={setResource}
          />
        ) : null}
      </ResourcePageAsyncState>
    </section>
  )
}

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`
