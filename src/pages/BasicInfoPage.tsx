import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { updateBasicInfo } from '../api/resources'
import { BasicInfoForm } from '../components/forms/BasicInfoForm'
import { AsyncState } from '../components/layout/AsyncState'
import { PageHeader } from '../components/layout/PageHeader'
import { useResource } from '../hooks/useResource'
import { resourceOverviewPath, useResourceId } from '../hooks/useResourceId'
import type { BasicInfo, Resource } from '../types/resource'
import {
  hasValidationErrors,
  validateBasicInfo,
  type BasicInfoFieldErrors,
} from '../utils/validation'

interface BasicInfoPageContentProps {
  resource: Resource
  resourceId: string
}

function BasicInfoPageContent({
  resource,
  resourceId,
}: BasicInfoPageContentProps) {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<BasicInfo>(resource.basicInfo)
  const [fieldErrors, setFieldErrors] = useState<BasicInfoFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (resource.status !== 'draft') {
      return
    }

    setSubmitError(null)
    const errors = validateBasicInfo(formValues)

    if (hasValidationErrors(errors)) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    updateBasicInfo(resourceId, formValues)
      .then(() => {
        navigate(resourceOverviewPath(resourceId))
      })
      .catch((error: unknown) => {
        setSubmitError(getErrorMessage(error))
        setIsSubmitting(false)
      })
  }

  const handleChange = (nextValue: BasicInfo) => {
    setFormValues(nextValue)
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
  }

  return (
    <BasicInfoForm
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

export function BasicInfoPage() {
  const resourceId = useResourceId()
  const { resource, loading, loadError, isNotFound } = useResource(resourceId)

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

      <AsyncState
        loading={loading}
        error={loadError}
        loadingMessage="Loading Basic Info…"
        errorTitle={isNotFound ? 'Resource not found' : 'Could not load resource'}
      >
        {resource ? (
          <BasicInfoPageContent
            key={resource._id}
            resource={resource}
            resourceId={resourceId}
          />
        ) : null}
      </AsyncState>
    </section>
  )
}
