import { Link } from "react-router-dom";

export default function QuickAction({ label, icon, href, onClick, highlight }) {
    const baseClassName = "flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer";
    const content = (
        <>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </>
    );

    if (onClick) {
        return <button type="button" onClick={onClick} className={baseClassName}>{content}</button>;
    }
    return <Link to={href} className={baseClassName}>{content}</Link>;
}
