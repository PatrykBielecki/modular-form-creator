import type { FormEvent } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { getErrorMessage } from '../../api/errors'
import { createResource } from '../../api/resources'
import { Button, Drawer, Input } from '../../design-system'
import type { Resource } from '../../types/resource'
import { validateResourceName } from '../../utils/validation'

interface CreateResourceDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (resource: Resource) => void
}

export function CreateResourceDrawer({
  isOpen,
  onClose,
  onCreated,
}: CreateResourceDrawerProps) {
  const [resourceName, setResourceName] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setResourceName('')
    setFieldError(undefined)
    setSubmitError(null)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }
    resetForm()
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const validationError = validateResourceName(resourceName)
    if (validationError) {
      setFieldError(validationError)
      return
    }

    setFieldError(undefined)
    setIsSubmitting(true)

    try {
      const resource = await createResource(resourceName.trim())
      onCreated(resource)
      resetForm()
      onClose()
    } catch (error) {
      setSubmitError(getErrorMessage(error))
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer title="Create resource" isOpen={isOpen} onClose={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Resource name"
          placeholder="My new resource"
          value={resourceName}
          onChange={(event) => {
            setResourceName(event.target.value)
            if (fieldError) {
              setFieldError(undefined)
            }
            if (submitError) {
              setSubmitError(null)
            }
          }}
          error={fieldError}
          helperText="Letters, numbers, spaces, and hyphens only."
          disabled={isSubmitting}
          autoFocus
        />
        {submitError ? <FormError role="alert">{submitError}</FormError> : null}
        <Actions>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create resource'}
          </Button>
        </Actions>
      </Form>
    </Drawer>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const FormError = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.95rem;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`
