import styled from 'styled-components'
import { PageHeader } from '../components/layout/PageHeader'
import { resourceOverviewPath, useResourceId } from '../hooks/useResourceId'

export function BasicInfoPage() {
  const resourceId = useResourceId()

  return (
    <section>
      <PageHeader
        title="Basic Info"
        description={`Module form for resource #${resourceId}`}
        backTo={resourceOverviewPath(resourceId)}
        backLabel="Back to overview"
      />
      <Placeholder>Basic Info form will be implemented here.</Placeholder>
    </section>
  )
}

const Placeholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`
