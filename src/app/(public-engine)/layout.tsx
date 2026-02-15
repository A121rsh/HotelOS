// src/app/(public-engine)/layout.tsx

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-black">
      {/* Subtle background effect */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-[#a1f554]/5 rounded-full blur-[180px] opacity-30" />
      </div>
      
      {children}
    </div>
  );
}