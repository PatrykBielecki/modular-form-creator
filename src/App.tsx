import { BrowserRouter } from 'react-router-dom'
import { CompletedResourceEditBufferProvider } from './context/CompletedResourceEditBufferProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <CompletedResourceEditBufferProvider>
        <AppRoutes />
      </CompletedResourceEditBufferProvider>
    </BrowserRouter>
  )
}

export default App
