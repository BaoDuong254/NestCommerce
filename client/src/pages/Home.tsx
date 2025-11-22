import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/constants";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    void (async () => {
      try {
        await logout();
        void navigate(ROUTES.LOGIN);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    })();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex'>
              <div className='flex shrink-0 items-center'>
                <h1 className='text-xl font-bold text-gray-900'>NestCommerce</h1>
              </div>
            </div>
            <div className='flex items-center'>
              <button
                onClick={handleLogout}
                className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='rounded-lg bg-white px-5 py-6 shadow sm:px-6'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>Welcome to NestCommerce!</h2>
          <div className='space-y-2'>
            <p className='text-gray-600'>You are successfully logged in.</p>
            {user && (
              <div className='mt-4 rounded-md bg-gray-50 p-4'>
                <h3 className='text-lg font-medium text-gray-900'>User Information</h3>
                <dl className='mt-2 space-y-1'>
                  <div>
                    <dt className='inline font-medium text-gray-700'>Name: </dt>
                    <dd className='inline text-gray-600'>{user.name}</dd>
                  </div>
                  <div>
                    <dt className='inline font-medium text-gray-700'>Email: </dt>
                    <dd className='inline text-gray-600'>{user.email}</dd>
                  </div>
                  <div>
                    <dt className='inline font-medium text-gray-700'>Phone: </dt>
                    <dd className='inline text-gray-600'>{user.phoneNumber}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
