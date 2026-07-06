import type { ReactNode } from 'react'
import styled from 'styled-components'

interface PageContainerProps {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return <Container>{children}</Container>
}

const Container = styled.main`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`
