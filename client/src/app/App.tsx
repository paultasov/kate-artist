import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import { SmoothScroll } from '@/shared/ui/SmoothScroll';
import { Layout } from './Layout';
import { HomePage } from '@/pages/home';
import { WorksPage } from '@/pages/works';
import { ArtworkPage } from '@/pages/artwork';
import { AboutPage } from '@/pages/about';
import { AdminPage } from '@/pages/admin';
import { ProfilePage } from '@/pages/profile';
import { ContactPage } from '@/pages/contact';
import { SettingsPage } from '@/pages/settings';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <SmoothScroll>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/works" element={<WorksPage />} />
                <Route path="/artwork/:id" element={<ArtworkPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
