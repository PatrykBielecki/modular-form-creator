import styled from 'styled-components'
import { PageHeader } from '../components/layout/PageHeader'
import { resourceOverviewPath, useResourceId } from '../hooks/useResourceId'

export function ProjectDetailsPage() {
  const resourceId = useResourceId()

  return (
    <section>
      <PageHeader
        title="Project Details"
        description={`Module form for resource #${resourceId}`}
        backTo={resourceOverviewPath(resourceId)}
        backLabel="Back to overview"
      />
      <Placeholder>Project Details form will be implemented here.</Placeholder>
    </section>
  )
}

const Placeholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`
