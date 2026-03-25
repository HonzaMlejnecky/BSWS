import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialLoginMode }) => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(initialLoginMode);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', username: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setIsLoginMode(initialLoginMode);
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      setShowModal(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialLoginMode]);

  if (!isOpen && !showModal) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginMode) {
        await login({ email: form.email, password: form.password });
        onClose();
      } else {
        if (form.password !== form.confirmPassword) throw new Error('Hesla se neshodují.');
        await register({ email: form.email, password: form.password, username: form.username || form.email.split('@')[0] });
        setIsLoginMode(true);
        setError('Registrace proběhla. Dokončete ověření e-mailu a přihlaste se.');
      }
    } catch (err) {
      setError(err.message || 'Autentizace selhala.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${showModal ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className={`bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-300 transform ${showModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2"><FaTimes size={20} /></button>
        <div className="p-8 pb-0 text-center">
          <h2 className="text-2xl font-bold text-[#004CAF] mb-6">{isLoginMode ? 'Vítejte zpět!' : 'Vytvořit účet'}</h2>
          <div className="flex bg-gray-100 p-1 rounded-full relative mb-8">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#004CAF] rounded-full transition-all duration-300 shadow-sm left-1 ${isLoginMode ? 'translate-x-0' : 'translate-x-full'}`} />
            <button className={`flex-1 py-2 text-sm font-semibold rounded-full relative z-10 transition-colors duration-300 ${isLoginMode ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setIsLoginMode(true)}>Přihlášení</button>
            <button className={`flex-1 py-2 text-sm font-semibold rounded-full relative z-10 transition-colors duration-300 ${!isLoginMode ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setIsLoginMode(false)}>Registrace</button>
          </div>
        </div>

        <form className="p-8 pt-0 space-y-4" onSubmit={onSubmit}>
          <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Váš e-mail" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />
          {!isLoginMode && <input type="text" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="Uživatelské jméno" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />}
          <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Heslo" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />
          {!isLoginMode && <input type="password" required value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} placeholder="Potvrzení hesla" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full bg-[#004CAF] text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all duration-300 mt-6 cursor-pointer disabled:opacity-50">{loading ? 'Probíhá...' : isLoginMode ? 'Přihlásit se' : 'Zaregistrovat se'}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
