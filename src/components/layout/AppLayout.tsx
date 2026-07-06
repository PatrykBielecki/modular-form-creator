import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { PageContainer } from './PageContainer'

export function AppLayout() {
  return (
    <Shell>
      <TopBar>
        <BrandLink to="/resources">Resources Management</BrandLink>
      </TopBar>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </Shell>
  )
}

const Shell = styled.div`
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const TopBar = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const BrandLink = styled(Link)`
  display: block;
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
