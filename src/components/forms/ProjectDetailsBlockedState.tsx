import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { resourceBasicInfoPath } from '../../hooks/useResourceId'

interface ProjectDetailsBlockedStateProps {
  resourceId: string
}

export function ProjectDetailsBlockedState({
  resourceId,
}: ProjectDetailsBlockedStateProps) {
  return (
    <Panel role="status">
      <Title>Basic Info must be completed first</Title>
      <Message>
        Project Details can be edited only after all Basic Info fields are
        filled in for this draft resource.
      </Message>
      <BasicInfoLink to={resourceBasicInfoPath(resourceId)}>
        Go to Basic Info
      </BasicInfoLink>
    </Panel>
  )
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 640px;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const BasicInfoLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
