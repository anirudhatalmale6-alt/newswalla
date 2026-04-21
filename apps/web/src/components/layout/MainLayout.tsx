import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
