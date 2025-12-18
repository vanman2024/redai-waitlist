export function WaitlistFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Brand */}
          <div className="mb-4">
            <span className="text-xl font-bold">
              <span className="text-red-600">Red</span> Seal Hub
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Red Seal Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
