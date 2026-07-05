const fs = require('fs');
const file = 'apps/web-admin/app/login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const [error, setError] = useState("");',
  'const [error, setError] = useState("");\n  const [isLoading, setIsLoading] = useState(false);'
);

const submitStart = `    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {`;
const submitEnd = `    } catch (err: any) {
      setError("Email atau password yang Anda masukkan salah.");
    } finally {
      setIsLoading(false);
    }
  };`;

content = content.replace(/    e\.preventDefault\(\);\n    setError\(\"\"\);\n    try \{/, submitStart);
content = content.replace(/    \} catch \(err: any\) \{\n      setError\(err\.message \|\| \"Failed to login\"\);\n    \}\n  \};/, submitEnd);

const buttonHtml = `          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : "Masuk ke Dashboard"}
          </button>`;

content = content.replace(/          <button[\s\S]*?<\/button>/, buttonHtml);

fs.writeFileSync(file, content);
