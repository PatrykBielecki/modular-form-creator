import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { PageHeader } from '../components/layout/PageHeader'
import {
  resourceBasicInfoPath,
  resourceDetailsPath,
  resourceProjectDetailsPath,
  useResourceId,
} from '../hooks/useResourceId'

export function ResourceOverviewPage() {
  const resourceId = useResourceId()

  return (
    <section>
      <PageHeader
        title="Resource Overview"
        description={`Resource #${resourceId}`}
        backTo="/resources"
        backLabel="All resources"
      />
      <Placeholder>Resource overview will be implemented here.</Placeholder>
      <NavList>
        <li>
          <NavLink to={resourceDetailsPath(resourceId)}>View details</NavLink>
        </li>
        <li>
          <NavLink to={resourceBasicInfoPath(resourceId)}>Basic Info module</NavLink>
        </li>
        <li>
          <NavLink to={resourceProjectDetailsPath(resourceId)}>
            Project Details module
          </NavLink>
        </li>
      </NavList>
    </section>
  )
}

const Placeholder = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const NavList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.ink};
`

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
