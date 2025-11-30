import logo from "/logo.png";

export const AuthLayout: React.FC<{
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Zedit Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-z-text mb-2">{title}</h1>
          {subtitle && <p className="text-z-text-secondary">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};
