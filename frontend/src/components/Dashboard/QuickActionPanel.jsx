import QuickAction from "./QuickAction";

export default function QuickActionsPanel({ onOpenCreateModal }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Rychlé akce</h2>
            <div className="flex flex-col gap-3">
                <QuickAction 
                    label="Vytvořit projekt" 
                    icon="+" 
                    onClick={onOpenCreateModal} 
                    highlight
                />
                <QuickAction label="Vytvořit databázi" icon="🗄" href="/databases" />
                <QuickAction label="Vytvořit FTP účet" icon="📂" href="/ftp" />
                <QuickAction label="Vytvořit e-mailový server" icon="📧" href="/emails" />
            </div>
        </div>
    );
}
