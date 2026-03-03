import { Link } from "react-router-dom";

export default function QuickAction({ label, href }) {
    return (
        <Link
            to={href}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
        >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                +
            </div>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}