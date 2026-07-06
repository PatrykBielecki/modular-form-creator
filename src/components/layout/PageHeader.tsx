import type { ReactNode } from 'react'
import styled from 'styled-components'
import { BackLink } from './BackLink'

interface PageHeaderProps {
  title: string
  description?: string
  backTo?: string
  backLabel?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  backTo,
  backLabel,
  actions,
}: PageHeaderProps) {
  return (
    <Header>
      {backTo && backLabel ? <BackLink to={backTo}>{backLabel}</BackLink> : null}
      <HeadingRow>
        <HeadingGroup>
          <Title>{title}</Title>
          {description ? <Description>{description}</Description> : null}
        </HeadingGroup>
        {actions ? <Actions>{actions}</Actions> : null}
      </HeadingRow>
    </Header>
  )
}

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const HeadingRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 1rem;
`

const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`
