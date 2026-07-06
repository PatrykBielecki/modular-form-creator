import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card } from '../../design-system'
import { ModuleCompletionBadge } from './ModuleCompletionBadge'

interface ModuleOverviewCardProps {
  title: string
  description: string
  complete: boolean
  actionLabel: string
  actionTo?: string
  blocked?: boolean
  blockedReason?: string
}

export function ModuleOverviewCard({
  title,
  description,
  complete,
  actionLabel,
  actionTo,
  blocked = false,
  blockedReason,
}: ModuleOverviewCardProps) {
  return (
    <Card variant="outline">
      <HeaderRow>
        <Title>{title}</Title>
        <ModuleCompletionBadge complete={complete} />
      </HeaderRow>
      <Description>{description}</Description>
      {blocked ? (
        <BlockedAction>
          <Button type="button" state="disabled" disabled>
            {actionLabel}
          </Button>
          {blockedReason ? (
            <BlockedReason>{blockedReason}</BlockedReason>
          ) : null}
        </BlockedAction>
      ) : actionTo ? (
        <ModuleLink to={actionTo}>{actionLabel}</ModuleLink>
      ) : null}
    </Card>
  )
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const BlockedAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`

const BlockedReason = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
`

const ModuleLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryStrong};
    border-color: ${({ theme }) => theme.colors.primaryStrong};
  }
`
