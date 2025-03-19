import Sidebar from '@/components/sidebar/Sidebar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </main>
  );
}
