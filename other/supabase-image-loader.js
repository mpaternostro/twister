export default function supabaseLoader(
  /** @type {import('next/image').ImageLoaderProps} */ { src, width, quality },
) {
  return `${
    process.env.NEXT_PUBLIC_SUPABASE_URL
  }/storage/v1/render/image/public/${src}?width=${width}&quality=${
    quality || 75
  }`;
}
