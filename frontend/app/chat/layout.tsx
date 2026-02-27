export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen justify-center bg-background">
      <div className="flex h-full w-full flex-col lg:w-[65%]">
        {children}
      </div>
    </div>
  )
}
