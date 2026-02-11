export default function CompanyTopbar() {
  const company = JSON.parse(localStorage.getItem("companyInfo"));

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-primary/20 bg-gray-50 dark:bg-black">
      <h1 className="text-xl font-bold"></h1>

      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
        {company?.companyName}
      </div>
    </div>
  );
}
