import { Link } from "react-router-dom";

export default function QuickAction({ label, icon, href, onClick, highlight }) {
    const content = (
        <>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </>
    );

    if (onClick) {
        return <button onClick={onClick} className="flex items-center gap-3 ...">{content}</button>;
    }
    return <Link to={href} className="flex items-center gap-3 ...">{content}</Link>;
}