import type { FormEvent } from 'react'
import styled from 'styled-components'
import {
  PROJECT_CATEGORY_OPTIONS,
  TEAM_MEMBER_VALUES,
} from '../../constants/formOptions'
import { Button, CheckboxGroup, Input, Select } from '../../design-system'
import type { ProjectDetails } from '../../types/resource'
import type { ProjectDetailsFieldErrors } from '../../utils/validation'

export type ProjectDetailsFormMode = 'draft' | 'completed'

interface ProjectDetailsFormProps {
  mode: ProjectDetailsFormMode
  value: ProjectDetails
  fieldErrors: ProjectDetailsFieldErrors
  submitError?: string | null
  isSubmitting?: boolean
  onChange: (value: ProjectDetails) => void
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}

export function ProjectDetailsForm({
  mode,
  value,
  fieldErrors,
  submitError = null,
  isSubmitting = false,
  onChange,
  onSubmit,
}: ProjectDetailsFormProps) {
  const isDraft = mode === 'draft'

  const updateField = <K extends keyof ProjectDetails>(
    field: K,
    fieldValue: ProjectDetails[K],
  ) => {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <Form onSubmit={isDraft ? onSubmit : undefined}>
      {mode === 'completed' ? (
        <CompletedNotice>
          This resource is completed. Edits here are temporary until you confirm
          and save them in a later step. Changes are not sent to the server yet.
        </CompletedNotice>
      ) : null}

      <Input
        label="Project name"
        value={value.projectName}
        onChange={(event) => updateField('projectName', event.target.value)}
        error={fieldErrors.projectName}
        disabled={isSubmitting}
      />

      <Input
        label="Budget"
        inputMode="numeric"
        value={value.budget}
        onChange={(event) => {
          const digitsOnly = event.target.value.replace(/\D/g, '')
          updateField('budget', digitsOnly)
        }}
        helperText="Integer digits only."
        error={fieldErrors.budget}
        disabled={isSubmitting}
      />

      <Select
        label="Category"
        value={value.category}
        options={PROJECT_CATEGORY_OPTIONS}
        tooltip="Category is required for project details."
        onChange={(event) => updateField('category', event.target.value)}
        error={fieldErrors.category}
        disabled={isSubmitting}
      />

      <CheckboxGroup
        label="Team members needed"
        tooltip="Select all roles required for this project."
        options={[...TEAM_MEMBER_VALUES]}
        value={value.options}
        onChange={(nextOptions) => updateField('options', nextOptions)}
        helper="Pick at least one team member."
        error={fieldErrors.options}
        disabled={isSubmitting}
      />

      {submitError ? <FormError role="alert">{submitError}</FormError> : null}

      {isDraft ? (
        <Actions>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Project Details'}
          </Button>
        </Actions>
      ) : null}
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 640px;
`

const CompletedNotice = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.info};
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(60, 90, 137, 0.08);
  color: ${({ theme }) => theme.colors.info};
  font-size: 0.95rem;
`

const FormError = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.95rem;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`
