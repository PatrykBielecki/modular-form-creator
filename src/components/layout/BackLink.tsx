import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface BackLinkProps {
  to: string
  children: string
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <StyledLink to={to}>
      <Arrow aria-hidden="true">←</Arrow>
      {children}
    </StyledLink>
  )
}

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.95rem;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryStrong};
    text-decoration: underline;
  }
`

const Arrow = styled.span`
  line-height: 1;
`
