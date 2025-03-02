import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className="flex min-h-screen items-center justify-center 
        bg-gradient-to-r from-orange-100 to-green-600 
        bg-cover bg-center bg-no-repeat px-4 py-24"
    >
      <section>{children}</section>
    </main>
  );
};

export default AuthLayout;
