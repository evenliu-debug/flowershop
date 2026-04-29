"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-xl font-semibold text-slate-900">Admin error</h1>
      <p className="mt-2 text-sm text-slate-600">
        Something went wrong while loading the admin area.
      </p>
      <pre className="mt-4 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
        {error.message}
        {error.digest ? `\nDigest: ${error.digest}` : ""}
      </pre>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Retry
        </button>
        <Link
          href="/en"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to storefront
        </Link>
      </div>
    </div>
  );
}

