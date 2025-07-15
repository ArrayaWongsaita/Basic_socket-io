import { Routes, Route } from 'react-router';
import AppLayout from '../shared/components/layout/AppLayout';

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<h1>Home</h1>} />
        <Route path="about" element={<h1>about</h1>} />

        {/* <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        </Route>

        <Route path="concerts">
        <Route index element={<ConcertsHome />} />
        <Route path=":city" element={<City />} />
        <Route path="trending" element={<Trending />} />
        </Route> */}
      </Route>
    </Routes>
  );
}
