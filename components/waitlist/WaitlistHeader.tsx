import Link from 'next/link';

export function WaitlistHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-center">
          {/* Centered Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-red-600">Red</span> Seal Hub
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
