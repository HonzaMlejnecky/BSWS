export default function PageHeader({ title, description, buttonText, onAction }) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-500 mt-1">{description}</p>
            </div>
            
            {buttonText && onAction && (
                <button 
                    onClick={onAction} 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg shadow-blue-100 font-medium"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
}