import StatCard from "./StatCard";

export default function StatsGrid({ projectsCount, dbCount, ftpCount, emailCount }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Projekty" value={projectsCount} href="/projects" color="bg-blue-100 text-blue-600" icon="📁" />
            <StatCard label="Databáze" value={dbCount} href="/databases" color="bg-green-100 text-green-600" icon="🗄" />
            <StatCard label="FTP účty" value={ftpCount} href="/ftp" color="bg-yellow-100 text-yellow-600" icon="📂" />
            <StatCard label="E-mailové servery" value={emailCount} href="/emails" color="bg-red-100 text-red-600" icon="📧" />
        </div>
    );
}
