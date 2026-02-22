export default function AuthGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Background Pattern — geometric grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="auth-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* diamond shape */}
              <path
                d="M30 5 L55 30 L30 55 L5 30 Z"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="0.5"
                opacity="0.35"
              />
              {/* inner cross lines */}
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="60"
                stroke="#a855f7"
                strokeWidth="0.3"
                opacity="0.15"
              />
              <line
                x1="0"
                y1="30"
                x2="60"
                y2="30"
                stroke="#a855f7"
                strokeWidth="0.3"
                opacity="0.15"
              />
              {/* corner accent dots */}
              <circle cx="30" cy="5" r="1.5" fill="#7c3aed" opacity="0.25" />
              <circle cx="55" cy="30" r="1.5" fill="#7c3aed" opacity="0.25" />
              <circle cx="30" cy="55" r="1.5" fill="#7c3aed" opacity="0.25" />
              <circle cx="5" cy="30" r="1.5" fill="#7c3aed" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-pattern)" />
        </svg>
      </div>

      {/* Decorative blurred shapes */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300/15 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
