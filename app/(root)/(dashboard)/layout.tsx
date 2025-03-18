import ServerSidebar from '@/components/Sidebar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen">
      <ServerSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </main>
  );
}
