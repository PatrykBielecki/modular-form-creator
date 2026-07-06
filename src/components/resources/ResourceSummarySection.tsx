import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Card } from '../../design-system'
import { ModuleCompletionBadge } from './ModuleCompletionBadge'

interface ResourceSummarySectionProps {
  title: string
  complete: boolean
  action?: ReactNode
  children: ReactNode
}

export function ResourceSummarySection({
  title,
  complete,
  action,
  children,
}: ResourceSummarySectionProps) {
  return (
    <Card variant="outline">
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <HeaderMeta>
          <ModuleCompletionBadge complete={complete} />
          {action}
        </HeaderMeta>
      </SectionHeader>
      <FieldGrid>{children}</FieldGrid>
    </Card>
  )
}

interface SummaryFieldProps {
  label: string
  value: ReactNode
}

export function SummaryField({ label, value }: SummaryFieldProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{value}</FieldValue>
    </Field>
  )
}

interface SummaryNavLinkProps {
  to: string
  children: string
}

export function SummaryNavLink({ to, children }: SummaryNavLinkProps) {
  return <StyledNavLink to={to}>{children}</StyledNavLink>
}

interface SummaryNavLinkDisabledProps {
  children: string
  reason: string
}

export function SummaryNavLinkDisabled({
  children,
  reason,
}: SummaryNavLinkDisabledProps) {
  return (
    <DisabledNav>
      <DisabledLabel>{children}</DisabledLabel>
      <DisabledReason>{reason}</DisabledReason>
    </DisabledNav>
  )
}

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const FieldGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`

const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.875rem;
  font-weight: 600;
`

const FieldValue = styled.span`
  color: ${({ theme }) => theme.colors.inkStrong};
  white-space: pre-wrap;
  word-break: break-word;
`

const StyledNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const DisabledNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const DisabledLabel = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
  font-weight: 600;
`

const DisabledReason = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
`
