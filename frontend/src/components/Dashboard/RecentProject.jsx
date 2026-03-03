export default function RecentProject({ name, status, url }) {
    const statusColor =
        status === "Running"
            ? "bg-green-500"
            : status === "Deploying"
                ? "bg-yellow-500"
                : "bg-red-500";

    return (
        <div className="flex items-center gap-4 py-3">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                <p className="text-xs text-gray-500 truncate">{url}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100">
                {status}
            </span>
        </div>
    );
}