import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { PageHeader } from '../components/layout/PageHeader'

export function NotFoundPage() {
  return (
    <section>
      <PageHeader
        title="Page not found"
        description="The page you requested does not exist."
      />
      <HomeLink to="/resources">Go to resources</HomeLink>
    </section>
  )
}

const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
