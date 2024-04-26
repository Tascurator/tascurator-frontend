import { Home } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-primary text-white">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="w-6 h-6" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center space-x-4">
          <Link href="/about">
            <a className="text-gray-600 hover:text-gray-900">About</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-600 hover:text-gray-900">Contact</a>
          </Link>
        </div>
      </div>
    </header>
  );
}
