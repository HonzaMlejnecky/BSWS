import QuickAction from "./QuickAction";

export default function QuickActionsPanel({ onOpenCreateModal }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            <div className="flex flex-col gap-3">
                <QuickAction 
                    label="Create Project" 
                    icon="+" 
                    onClick={onOpenCreateModal} 
                    highlight
                />
                <QuickAction label="Create Database" icon="🗄" href="/databases" />
                <QuickAction label="Create FTP Account" icon="📂" href="/ftp" />
                <QuickAction label="Create Email Server" icon="📧" href="/dashboard/emails" />
            </div>
        </div>
    );
}