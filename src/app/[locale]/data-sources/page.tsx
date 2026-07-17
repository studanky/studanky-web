import { generateLegalMetadata, LegalRoutePage } from "@/components/legal/legal-route";

const documentId = "dataSources";

export function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  return generateLegalMetadata(props, documentId);
}

export default function Page(props: { params: Promise<{ locale: string }> }) {
  return <LegalRoutePage {...props} documentId={documentId} />;
}
