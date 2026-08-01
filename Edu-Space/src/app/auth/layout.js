export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-gutter relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container via-surface-bright to-primary-fixed opacity-40 -z-10 blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-[2rem] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6">
          <div className="w-24 h-24 bg-secondary-fixed/30 rounded-full blur-2xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="w-32 h-32 bg-primary-fixed/30 rounded-full blur-2xl"></div>
        </div>
        
        <div className="p-8 md:p-12 relative z-10">
          {children}
        </div>
      </div>
    </main>
  );
}
