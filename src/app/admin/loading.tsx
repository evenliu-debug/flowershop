export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
      </div>
      <div className="mt-8 h-48 animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}

