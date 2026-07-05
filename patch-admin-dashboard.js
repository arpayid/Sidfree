const fs = require('fs');
let page = fs.readFileSync('apps/web-admin/app/page.tsx', 'utf8');

page = page.replace(
  `    // Simulasi fetch stats
    setTimeout(() => {
      setStats({
        totalResidents: 3245,
        totalFamilies: 912,
        totalLetters: 1450,
        pendingComplaints: 12,
        chartData: [
          { name: "Jan", surat: 120, aduan: 10 },
          { name: "Feb", surat: 150, aduan: 15 },
          { name: "Mar", surat: 180, aduan: 8 },
          { name: "Apr", surat: 140, aduan: 20 },
          { name: "Mei", surat: 200, aduan: 12 },
          { name: "Jun", surat: 170, aduan: 5 },
        ]
      });
    }, 500);`,
  `    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: \`Bearer \${token}\` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();`
);

fs.writeFileSync('apps/web-admin/app/page.tsx', page);
