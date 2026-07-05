const fs = require('fs');
const file = 'apps/web-public/app/aduan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);`;

const newStr = `      const res = await fetch("/api/public/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error("Gagal mengirim laporan");
      }
      setIsSubmitted(true);
      setFormData({ title: "", content: "", nik: "" });`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(file, content);
