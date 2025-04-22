
// Replace the existing profFooter generation with:
const profFooter = `
  <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: left;">
    <p style="color: #111827; font-size: 15px; margin-bottom: 6px;">
      <strong>Nome:</strong> ${professionalInfo.name || "-"}
    </p>
    <p style="color: #111827; font-size: 15px; margin-bottom: 6px;">
      <strong>Telefone:</strong> ${professionalInfo.phone || "-"}
    </p>
    <p style="color: #111827; font-size: 15px;">
      <strong>Email:</strong> ${professionalInfo.email || "-"}
    </p>
  </div>
`;
