import styled from 'styled-components'
import { PageHeader } from '../components/layout/PageHeader'
import { resourceOverviewPath, useResourceId } from '../hooks/useResourceId'

export function ResourceDetailsPage() {
  const resourceId = useResourceId()

  return (
    <section>
      <PageHeader
        title="Resource Details"
        description={`Summary for resource #${resourceId}`}
        backTo={resourceOverviewPath(resourceId)}
        backLabel="Back to overview"
      />
      <Placeholder>Resource details summary will be implemented here.</Placeholder>
    </section>
  )
}

const Placeholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`
