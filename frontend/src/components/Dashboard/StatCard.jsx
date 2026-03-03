import { Link } from "react-router-dom";

export default function StatCard({ label, value, icon, href, color }) {
    return (
        <Link
            to={href}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-200 group"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} transition-all duration-200 group-hover:scale-110`}>
                    {icon}
                </div>
            </div>
        </Link>
    );
}