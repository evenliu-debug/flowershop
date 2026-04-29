import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-blue-700 hover:text-blue-800"
      >
        Home
      </Link>
    </div>
  );
}
