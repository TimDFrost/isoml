export default function PrivacyPage() {
  return (
    <div className="container-max section-padding pt-24">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-white/60">
        Oh Ya Inc. respects your privacy. ISOML handles sensitive legal data with
        the highest standards of security and confidentiality. We do not sell
        personal information. Data uploaded to ISOML is encrypted in transit and
        at rest.
      </p>
      <p className="mt-4 text-white/60">
        For privacy inquiries, contact{" "}
        <a href="mailto:privacy@isoml.com" className="text-olive-light hover:underline">
          privacy@isoml.com
        </a>
        .
      </p>
    </div>
  );
}
