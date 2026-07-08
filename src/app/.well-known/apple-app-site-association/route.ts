import { NextResponse } from "next/server";

// Apple App Site Association — Universal Links for the installed iOS app.
// URL: https://studankyapp.cz/.well-known/apple-app-site-association
// Modern format (iOS 13+): applinks.details[].appIDs + components.
const appleAppSiteAssociation = {
  applinks: {
    details: [
      {
        appIDs: ["T8Z25PVJ78.cz.studankyapp.studanky"], // TeamID.BundleID
        components: [
          {
            "/": "/s/*",
            comment: "Shared spring deep links open the app on the detail.",
          },
        ],
      },
    ],
  },
} as const;

export function GET() {
  // NextResponse.json sets Content-Type: application/json and status 200 (no redirect).
  return NextResponse.json(appleAppSiteAssociation, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
