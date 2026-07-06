import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getErrorMessage } from '../api/errors'
import { updateProjectDetails } from '../api/resources'
import { ProjectDetailsBlockedState } from '../components/forms/ProjectDetailsBlockedState'
import { ProjectDetailsForm } from '../components/forms/ProjectDetailsForm'
import { BufferedChangesNotice } from '../components/resources/BufferedChangesNotice'
import { PersistCompletedChangesPanel } from '../components/resources/PersistCompletedChangesPanel'
import { PageHeader } from '../components/layout/PageHeader'
import { ResourcePageAsyncState } from '../components/layout/ResourcePageAsyncState'
import { useCompletedResourceEditBuffer } from '../hooks/useCompletedResourceEditBuffer'
import { useResource } from '../hooks/useResource'
import { resourceOverviewPath, useResourceId } from '../hooks/useResourceId'
import type { ProjectDetails, Resource } from '../types/resource'
import { canEditProjectDetails } from '../utils/moduleCompletion'
import { getResourceEditView, hasBufferedChanges } from '../utils/mergeResource'
import {
  hasValidationErrors,
  validateProjectDetails,
  type ProjectDetailsFieldErrors,
} from '../utils/validation'

interface ProjectDetailsPageContentProps {
  resource: Resource
  resourceId: string
  onResourceUpdated: (resource: Resource) => void
}

function ProjectDetailsPageContent({
  resource,
  resourceId,
  onResourceUpdated,
}: ProjectDetailsPageContentProps) {
  const navigate = useNavigate()
  const { getBuffer, setProjectDetailsBuffer } = useCompletedResourceEditBuffer()
  const buffer = getBuffer(resourceId)
  const editView = getResourceEditView(resource, buffer)
  const isCompleted = resource.status === 'completed'

  const [formValues, setFormValues] = useState<ProjectDetails>(
    editView.projectDetails,
  )
  const [fieldErrors, setFieldErrors] = useState<ProjectDetailsFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showBufferedNotice =
    isCompleted && hasBufferedChanges(resource, getBuffer(resourceId))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    const errors = validateProjectDetails(formValues)
    if (hasValidationErrors(errors)) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    if (isCompleted) {
      setProjectDetailsBuffer(resourceId, formValues)
      setSubmitSuccess(
        'Temporary Project Details changes saved in memory. Persist them with a full update when ready.',
      )
      return
    }

    setIsSubmitting(true)

    updateProjectDetails(resourceId, formValues)
      .then((updatedResource) => {
        onResourceUpdated(updatedResource)
        navigate(resourceOverviewPath(resourceId))
      })
      .catch((error: unknown) => {
        setSubmitError(getErrorMessage(error))
        setIsSubmitting(false)
      })
  }

  const handleChange = (nextValue: ProjectDetails) => {
    setFormValues(nextValue)
    setFieldErrors((current) => {
      const nextErrors = { ...current }
      for (const key of Object.keys(nextValue) as (keyof ProjectDetails)[]) {
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
      <ProjectDetailsForm
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

export function ProjectDetailsPage() {
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

  const isDraftBlocked =
    resource?.status === 'draft' &&
    !canEditProjectDetails(resource.basicInfo)

  return (
    <section>
      <PageHeader
        title="Project Details"
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
        loadingMessage="Loading Project Details…"
      >
        {resource ? (
          isDraftBlocked ? (
            <ProjectDetailsBlockedState resourceId={resourceId} />
          ) : (
            <ProjectDetailsPageContent
              key={`${resource._id}-${bufferRevision}`}
              resource={resource}
              resourceId={resourceId}
              onResourceUpdated={setResource}
            />
          )
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
