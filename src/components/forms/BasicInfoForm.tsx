import type { FormEvent } from 'react'
import styled from 'styled-components'
import { PRIORITY_OPTIONS } from '../../constants/formOptions'
import { Button, Input, Select } from '../../design-system'
import type { BasicInfo } from '../../types/resource'
import type { BasicInfoFieldErrors } from '../../utils/validation'

export type BasicInfoFormMode = 'draft' | 'completed'

interface BasicInfoFormProps {
  mode: BasicInfoFormMode
  value: BasicInfo
  fieldErrors: BasicInfoFieldErrors
  submitError?: string | null
  submitSuccess?: string | null
  isSubmitting?: boolean
  onChange: (value: BasicInfo) => void
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}

export function BasicInfoForm({
  mode,
  value,
  fieldErrors,
  submitError = null,
  submitSuccess = null,
  isSubmitting = false,
  onChange,
  onSubmit,
}: BasicInfoFormProps) {
  const isDraft = mode === 'draft'

  const updateField = <K extends keyof BasicInfo>(
    field: K,
    fieldValue: BasicInfo[K],
  ) => {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <Form onSubmit={onSubmit}>
      {mode === 'completed' ? (
        <CompletedNotice>
          Changes are stored in temporary in-memory state only. They are not
          sent to the server until you explicitly persist them with a full
          update below.
        </CompletedNotice>
      ) : null}

      <Input
        label="Resource name"
        value={value.resourceName}
        state="locked"
        tooltip="Resource name is immutable after creation."
        helperText="This value cannot be changed after creation."
        error={fieldErrors.resourceName}
      />

      <Input
        label="Owner"
        value={value.owner}
        onChange={(event) => updateField('owner', event.target.value)}
        error={fieldErrors.owner}
        disabled={isSubmitting}
      />

      <Input
        label="Email"
        type="email"
        value={value.email}
        onChange={(event) => updateField('email', event.target.value)}
        error={fieldErrors.email}
        disabled={isSubmitting}
      />

      <Input
        label="Description"
        multiline
        rows={5}
        value={value.description}
        onChange={(event) => updateField('description', event.target.value)}
        error={fieldErrors.description}
        disabled={isSubmitting}
      />

      <Select
        label="Priority"
        value={value.priority}
        options={PRIORITY_OPTIONS}
        onChange={(event) => updateField('priority', event.target.value)}
        error={fieldErrors.priority}
        disabled={isSubmitting}
      />

      {submitError ? <FormError role="alert">{submitError}</FormError> : null}
      {submitSuccess ? <FormSuccess role="status">{submitSuccess}</FormSuccess> : null}

      <Actions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving…'
            : isDraft
              ? 'Save Basic Info'
              : 'Save temporary changes'}
        </Button>
      </Actions>
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

const FormSuccess = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.95rem;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`
