import { ReactNode } from 'react';
import Navigation from './Navigation';

interface AdminLayoutProps {
  children?: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <div className='overflow-y-auto'>
        {/* <Navigation /> */}
      </div>
      
      <main className="ml-64 flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </header>
        
        <div className="bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
