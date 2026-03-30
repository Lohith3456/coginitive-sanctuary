export default function Unauthorized() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">403 — Forbidden</h1>
        <p className="mt-2 text-gray-600">You don&apos;t have permission to view this page.</p>
        <a href="/login" className="mt-4 inline-block text-blue-600 underline">Back to login</a>
      </div>
    </main>
  );
}
