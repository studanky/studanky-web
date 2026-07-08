import { NextResponse } from "next/server";

// Android App Links — Digital Asset Links for domain ownership verification.
// URL: https://studankyapp.cz/.well-known/assetlinks.json
const assetLinks = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "cz.studankyapp.studanky",
      sha256_cert_fingerprints: [
        "4B:4C:B0:03:63:07:6E:61:53:C5:0A:CD:0A:D5:13:57:38:A1:9C:31:1D:13:01:6D:6C:78:50:E8:DB:8C:20:C9",
        "FC:14:51:95:A0:0F:EB:8C:2B:72:1A:8C:A6:83:26:54:23:94:E3:AE:52:63:A0:FE:D5:08:9E:FA:EC:8C:02:95",
        "96:9E:FD:A0:95:B8:AE:E6:15:06:6A:71:97:6F:D3:16:11:1C:4E:69:37:6A:99:7D:EF:C7:93:92:5D:AE:F8:DE",
      ],
    },
  },
] as const;

export function GET() {
  // NextResponse.json sets Content-Type: application/json and status 200 (no redirect).
  return NextResponse.json(assetLinks, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
