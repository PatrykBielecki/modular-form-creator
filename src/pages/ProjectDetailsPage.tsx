import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { updateProjectDetails } from '../api/resources'
import { ProjectDetailsBlockedState } from '../components/forms/ProjectDetailsBlockedState'
import { ProjectDetailsForm } from '../components/forms/ProjectDetailsForm'
import { AsyncState } from '../components/layout/AsyncState'
import { PageHeader } from '../components/layout/PageHeader'
import { useResource } from '../hooks/useResource'
import {
  resourceOverviewPath,
  useResourceId,
} from '../hooks/useResourceId'
import type { ProjectDetails, Resource } from '../types/resource'
import { canEditProjectDetails } from '../utils/moduleCompletion'
import {
  hasValidationErrors,
  validateProjectDetails,
  type ProjectDetailsFieldErrors,
} from '../utils/validation'

interface ProjectDetailsPageContentProps {
  resource: Resource
  resourceId: string
}

function ProjectDetailsPageContent({
  resource,
  resourceId,
}: ProjectDetailsPageContentProps) {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<ProjectDetails>(
    resource.projectDetails,
  )
  const [fieldErrors, setFieldErrors] = useState<ProjectDetailsFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (resource.status !== 'draft') {
      return
    }

    setSubmitError(null)
    const errors = validateProjectDetails(formValues)

    if (hasValidationErrors(errors)) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    updateProjectDetails(resourceId, formValues)
      .then(() => {
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
  }

  return (
    <ProjectDetailsForm
      mode={resource.status === 'completed' ? 'completed' : 'draft'}
      value={formValues}
      fieldErrors={fieldErrors}
      submitError={submitError}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}

export function ProjectDetailsPage() {
  const resourceId = useResourceId()
  const { resource, loading, loadError, isNotFound } = useResource(resourceId)

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

      <AsyncState
        loading={loading}
        error={loadError}
        loadingMessage="Loading Project Details…"
        errorTitle={isNotFound ? 'Resource not found' : 'Could not load resource'}
      >
        {resource ? (
          isDraftBlocked ? (
            <ProjectDetailsBlockedState resourceId={resourceId} />
          ) : (
            <ProjectDetailsPageContent
              key={resource._id}
              resource={resource}
              resourceId={resourceId}
            />
          )
        ) : null}
      </AsyncState>
    </section>
  )
}
