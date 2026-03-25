import { RouterProvider } from 'react-router';
import { router } from './app.routes';
import SongProvider from './features/Songs/song.context';
import AuthProvider from './features/Auth/auth.context';

function App() {
  return (
    <AuthProvider>
      <SongProvider>
        <RouterProvider router={router} />
      </SongProvider>
    </AuthProvider>
  )
}

export default App
