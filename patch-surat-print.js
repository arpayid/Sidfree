const fs = require('fs');
let page = fs.readFileSync('apps/web-admin/app/surat/page.tsx', 'utf8');

page = page.replace(
  `  const handleUpdateStatus = async (id: string, newStatus: string) => {`,
  `  const handlePrintLetter = (letter: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(\`
        <html>
          <head>
            <title>Cetak Surat \${letter.type}</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; padding: 40px; }
              .header { text-align: center; border-bottom: 2px solid black; margin-bottom: 20px; padding-bottom: 10px; }
              .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
              .header h2 { margin: 5px 0 0 0; font-size: 18px; font-weight: normal; }
              .content { margin-top: 30px; }
              .footer { margin-top: 50px; text-align: right; }
              .footer-signature { margin-top: 80px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PEMERINTAH DESA SUKAMAJU</h1>
              <h2>KECAMATAN MAJU JAYA, KABUPATEN INDONESIA</h2>
              <p style="margin: 0;">Jl. Raya Sukamaju No. 1 Kode Pos 12345</p>
            </div>
            <div class="content">
              <h3 style="text-align: center; text-decoration: underline; text-transform: uppercase;">\${letter.type}</h3>
              <p>Yang bertanda tangan di bawah ini Kepala Desa Sukamaju, menerangkan dengan sebenarnya bahwa:</p>
              <table style="margin: 20px 0; width: 100%;">
                <tr><td style="width: 200px;">Nama</td><td>: \${letter.resident?.name || '-'}</td></tr>
                <tr><td>NIK</td><td>: \${letter.resident?.nik || '-'}</td></tr>
              </table>
              <p>Surat keterangan ini diberikan untuk keperluan yang bersangkutan. Demikian surat ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>
            </div>
            <div class="footer">
              <p>Sukamaju, \${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Kepala Desa,</p>
              <div class="footer-signature">
                <p><strong>Bpk. Ahmad Subarjo</strong></p>
              </div>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      \`);
      printWindow.document.close();
      
      // Update status to Printed if not already
      if (letter.status !== "Printed") {
        handleUpdateStatus(letter.id, "Printed");
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {`
);

page = page.replace(
  `onClick={() =>
                            handleUpdateStatus(letter.id, "Printed")
                          }`,
  `onClick={() => handlePrintLetter(letter)}`
);

fs.writeFileSync('apps/web-admin/app/surat/page.tsx', page);
