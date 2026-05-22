import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/cn';

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-[--color-bg-base]">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-200',
          sidebarOpen ? 'lg:ml-[240px]' : 'lg:ml-[68px]'
        )}
      >
        <Header />
        <main className="p-5 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}