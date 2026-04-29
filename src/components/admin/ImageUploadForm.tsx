"use client";

import { uploadProductImage } from "@/actions/admin";

type Img = {
  id: string;
  storage_path: string;
  alt_en: string;
  alt_zh: string;
};

export function ImageUploadForm({
  productId,
  images,
}: {
  productId: string;
  images: Img[];
}) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-900">Images (Supabase Storage)</h2>
      <ul className="text-sm text-slate-600">
        {images.map((im) => (
          <li key={im.id} className="font-mono text-xs">
            {im.storage_path}
          </li>
        ))}
      </ul>
      <form action={uploadProductImage} encType="multipart/form-data" className="space-y-3">
        <input type="hidden" name="product_id" value={productId} />
        <label className="block text-sm">
          File
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="mt-1 block w-full text-sm"
          />
        </label>
        <label className="block text-sm">
          Alt EN
          <input name="alt_en" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <label className="block text-sm">
          Alt ZH
          <input name="alt_zh" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <input type="hidden" name="sort_order" value={images.length} />
        <button
          type="submit"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
