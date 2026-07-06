import styled from 'styled-components'

interface BufferedChangesNoticeProps {
  message?: string
}

export function BufferedChangesNotice({
  message = 'This completed resource has temporary unsaved changes stored in memory only. They will be lost on refresh or if you close the app until you persist them through a full update.',
}: BufferedChangesNoticeProps) {
  return (
    <Notice role="status">
      <Title>Unsaved temporary changes</Title>
      <Message>{message}</Message>
    </Notice>
  )
}

const Notice = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(180, 71, 27, 0.08);
`

const Title = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.warning};
  font-weight: 600;
`

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  font-size: 0.95rem;
`
