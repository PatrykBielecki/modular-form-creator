import styled from 'styled-components'
import { PageHeader } from '../components/layout/PageHeader'

export function ResourcesListPage() {
  return (
    <section>
      <PageHeader
        title="Resources"
        description="Create, track, and complete resources through the module workflow."
      />
      <Placeholder>Resources list will be implemented here.</Placeholder>
    </section>
  )
}

const Placeholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`
