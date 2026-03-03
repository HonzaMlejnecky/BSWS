export default function EmptyState({ title, buttonText, onAction }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button 
                onClick={onAction} 
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
                {buttonText}
            </button>
        </div>
    );
}