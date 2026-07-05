const fs = require('fs');
let page = fs.readFileSync('apps/web-admin/app/pengaturan/page.tsx', 'utf8');

page = page.replace(
  `  // Simulasikan fetch data
  useEffect(() => {
    const saved = localStorage.getItem("desa_settings");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulasikan delay API
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem("desa_settings", JSON.stringify(formData));
      toast.success("Pengaturan desa berhasil disimpan");
    } catch (err) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };`,
  `  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/tenant", {
          headers: { Authorization: \`Bearer \${token}\` },
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({ ...formData, namaDesa: data.name });
        }
      } catch (e) {}
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tenant", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: \`Bearer \${token}\` 
        },
        body: JSON.stringify({ name: formData.namaDesa }),
      });
      if (res.ok) {
        toast.success("Pengaturan desa berhasil disimpan");
      } else {
        toast.error("Gagal menyimpan pengaturan. Pastikan anda memiliki akses.");
      }
    } catch (err) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };`
);

fs.writeFileSync('apps/web-admin/app/pengaturan/page.tsx', page);
