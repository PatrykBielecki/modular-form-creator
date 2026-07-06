import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface ResourceLoadErrorActionsProps {
  variant: 'not-found' | 'invalid-id' | 'generic'
}

export function ResourceLoadErrorActions({
  variant,
}: ResourceLoadErrorActionsProps) {
  return (
    <Actions>
      <ActionLink to="/resources">Back to resources list</ActionLink>
      {variant === 'not-found' ? (
        <Hint>The resource may have been deleted or the link is incorrect.</Hint>
      ) : null}
      {variant === 'invalid-id' ? (
        <Hint>Use a valid numeric resource id from the resources list.</Hint>
      ) : null}
    </Actions>
  )
}

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`

const ActionLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Hint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
`
