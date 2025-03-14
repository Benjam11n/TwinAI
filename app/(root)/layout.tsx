import { NavBar } from '@/components/ui/NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="w-full flex-1 bg-background/85">
        <div className="container mx-auto mt-16 sm:px-6 lg:px-8">
          <NavBar />
          {children}
        </div>
      </main>
    </div>
  );
}
