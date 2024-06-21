/**
 *
 * A Loading spinner component to show while data is updating
 *
 * @example
 * layout.tsx
 *
 * <html lang="en">
 *   <body className={cn('flex justify-center items-start w-screen min-h-screen bg-primary-lightest', roboto.className,)}>
 *     <LoadingSpinner />
 *     <main className={'max-w-screen-sm min-h-screen w-full h-full bg-white px-6'}>
 *       {children}
 *     </main>
 *     <Toaster />
 *   </body>
 * </html>
 *
 */

export const LoadingSpinner = () => {
  return (
    <div className="fixed z-50 bg-black/50 w-full h-full flex justify-center items-center">
      <div className="border-gray-200 h-12 w-12 animate-spin rounded-full border-4 border-t-primary" />
    </div>
  );
};
