const fs = require('fs');
const file = 'apps/web-public/app/layanan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `      // We simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);`;

const newStr = `      const res = await fetch("/api/public/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengirim pengajuan");
      }
      setIsSubmitted(true);
      setFormData({ nik: "", type: "Surat Keterangan Tidak Mampu (SKTM)", keperluan: "" });`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(file, content);
