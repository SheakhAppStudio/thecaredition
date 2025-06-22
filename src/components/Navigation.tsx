import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  Cog6ToothIcon,
  InboxIcon,
  ClockIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const pathname = usePathname();
  
  // Main navigation items
  const mainNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Service Bookings', href: '/bookings', icon: ClipboardDocumentListIcon },
  ];

  // Customer section items
  const customerNavItems = [
    { name: 'Customer Directory', href: '/dashboard/customer-directory', icon: UserGroupIcon },
  ];

  // Booking status sections
  const bookingStatusItems = [
    { name: 'New Requests', href: '/dashboard/bookings/new', icon: InboxIcon },
    { name: 'Booked Services', href: '/dashboard/bookings/booked-services', icon: CheckCircleIcon },
    { name: 'Waiting Response', href: '/dashboard/bookings/waiting-response', icon: ClockIcon },
    { name: 'Completed', href: '/dashboard/bookings/completed', icon: CheckCircleIcon },
    { name: 'Cancelled Jobs', href: '/dashboard/bookings/cancelled-jobs', icon: QuestionMarkCircleIcon },
  ];
  // Blog status sections
  const blogStatusItems = [
    { name: 'Add Blog', href: '/dashboard/add-blog', icon: InboxIcon },
    { name: 'Blog List', href: '/dashboard/blog-list', icon: CheckCircleIcon },
  ];
  // Video status sections
  const videoStatusItems = [
    { name: 'Add Video', href: '/dashboard/add-video', icon: InboxIcon },
    { name: 'Video List', href: '/dashboard/video-list', icon: CheckCircleIcon },
  ];

  // Settings
  const settingsItems = [
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4 fixed overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Car Edition Pro</h1>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>
      
      {/* Main Navigation */}
      <div className="mb-6">
        <ul className="space-y-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Customer Section */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 pl-3">Customers</h3>
        <ul className="space-y-2">
          {customerNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Booking Status Section */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 pl-3">Booking Status</h3>
        <ul className="space-y-2">
          {bookingStatusItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Blog Status Section */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 pl-3">Blog Status</h3>
        <ul className="space-y-2">
          {blogStatusItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Video Status Section */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 pl-3">Video Status</h3>
        <ul className="space-y-2">
          {videoStatusItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Settings */}
      <div className="mb-6">
        <ul className="space-y-2">
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center space-x-3 border-t border-gray-700 pt-4">
          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@caredition.pro</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
