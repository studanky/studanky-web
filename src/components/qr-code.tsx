import { encode } from "uqr";

/**
 * Live QR code rendered as inline SVG (server-side, zero client JS). Encoding
 * the URL at render time — instead of shipping a pre-made image — means every
 * QR on the site always matches `downloadUrl` and restyles with the theme via
 * `currentColor`.
 */
export function QrCode({
  data,
  label,
  className,
}: {
  data: string;
  label: string;
  className?: string;
}) {
  // ECC "M" survives ~15% damage — sensible for on-screen codes scanned from
  // varying distances; border modules keep the quiet zone scanners need.
  const qr = encode(data, { ecc: "M", border: 2 });

  let path = "";
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.data[y][x]) path += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${qr.size} ${qr.size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={className}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}
