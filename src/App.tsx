import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/pages/Dashboard';
import Trips from '@/pages/Trips';
import NewTrip from '@/pages/NewTrip';
import ProfilePage from '@/pages/ProfilePage';
import { useTrips } from '@/hooks/useTrips';
import { useProfile } from '@/hooks/useProfile';

export default function App() {
  const { trips, addTrip, deleteTrip } = useTrips();
  const { profile, updateProfile } = useProfile();

  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard trips={trips} />} />
            <Route path="/viagens" element={<Trips trips={trips} onDelete={deleteTrip} />} />
            <Route path="/nova" element={<NewTrip profile={profile} onAdd={addTrip} />} />
            <Route path="/perfil" element={<ProfilePage profile={profile} onUpdate={updateProfile} />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
