import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Play, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Settings, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

const CardChecker = () => {
  const [cards, setCards] = useState([]);
  const [input, setInput] = useState('');
  const [apiKeys, setApiKeys] = useState({
    stripe: '',
    paypal: '',
    asaas: ''
  });
  const [gateway, setGateway] = useState('stripe');
  const [isChecking, setIsChecking] = useState(false);
  const [stats, setStats] = useState({ live: 0, dead: 0, total: 0 });
  const [showSettings, setShowSettings] = useState(false);

  const handleAddCards = () => {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const newCards = lines.map(line => ({
      id: Math.random().toString(36).substr(2, 9),
      data: line.trim(),
      status: 'pending',
      response: ''
    }));
    setCards([...cards, ...newCards]);
    setInput('');
  };

  const clearCards = () => {
    setCards([]);
    setStats({ live: 0, dead: 0, total: 0 });
  };

  const checkCard = async (card) => {
    // Simulação de requisição para as APIs
    // Na implementação real, aqui entraria o fetch para o seu backend que consome as APIs
    return new Promise((resolve) => {
      setTimeout(() => {
        const rand = Math.random();
        if (rand > 0.7) {
          resolve({ status: 'live', response: 'Approved / Authorized' });
        } else if (rand > 0.3) {
          resolve({ status: 'dead', response: 'Declined / Insufficient Funds' });
        } else {
          resolve({ status: 'error', response: 'API Error / Gateway Timeout' });
        }
      }, 1500);
    });
  };

  const startChecking = async () => {
    if (!apiKeys[gateway]) {
      alert(`Por favor, insira a API Key do ${gateway} nas configurações.`);
      return;
    }

    setIsChecking(true);
    const pendingCards = cards.filter(c => c.status === 'pending');
    
    for (let card of pendingCards) {
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, status: 'checking' } : c));
      
      const result = await checkCard(card);
      
      setCards(prev => prev.map(c => 
        c.id === card.id ? { ...c, status: result.status, response: result.response } : c
      ));
      
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        live: result.status === 'live' ? prev.live + 1 : prev.live,
        dead: result.status === 'dead' ? prev.dead + 1 : prev.dead,
      }));
    }
    setIsChecking(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap className="text-white w-6 h-6" />
               </div>
            <h1 className="text-2xl font-bold tracking-tight">SKYNET <span className="text-indigo-500">CHECKER</span></h1>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <CheckCircle2 className="text-green-500 w-4 h-4" />
              <span className="text-sm font-medium">Live: {stats.live}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <XCircle className="text-red-500 w-4 h-4" />
              <span className="text-sm font-medium">Dead: {stats.dead}</span>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors border border-slate-700"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Settings Modal */}
        {showSettings && (
          <div className="mb-6 p-6 bg-slate-900 rounded-2xl border border-indigo-500/30 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-indigo-400" /> Configurações de API
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Stripe Key</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none"
                  placeholder="sk_test_..." 
                  value={apiKeys.stripe}
                  onChange={(e) => setApiKeys({...apiKeys, stripe: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">PayPal Client ID</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none"
                  placeholder="AX_..." 
                  value={apiKeys.paypal}
                  onChange={(e) => setApiKeys({...apiKeys, paypal: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Asaas Token</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none"
                  placeholder="$a_..." 
                  value={apiKeys.asaas}
                  onChange={(e) => setApiKeys({...apiKeys, asaas: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" /> Lista de Cartões
              </label>
              <textarea 
                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono focus:ring-2 ring-indigo-500 outline-none transition-all"
                placeholder="Número|Mês|Ano|CVV"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                onClick={handleAddCards}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                Adicionar à Lista
              </button>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
              <label className="block text-sm font-medium mb-3">Selecionar Gateway</label>
              <div className="grid grid-cols-1 gap-2">
                {['stripe', 'paypal', 'asaas'].map((g) => (
                  <button 
                    key={g}
                    onClick={() => setGateway(g)}
                    className={`py-2 px-4 rounded-lg text-left capitalize transition-all ${gateway === g ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <button 
                onClick={startChecking}
                disabled={isChecking || cards.length === 0}
                className={`w-full mt-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isChecking || cards.length === 0 ? 'bg-slate-700 cursor-not-allowed text-slate-500' : 'bg-green-600 hover:bg-green-500 text-white active:scale-95'}`}
              >
                <Play className="w-4 h-4 fill-current" /> {isChecking ? 'Verificando...' : 'Iniciar Checker'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Resultados em Tempo Real</h3>
                <button 
                  onClick={clearCards}
                  className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Limpar Tudo
                </button>
              </div>
              
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-900 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="p-4 border-b border-slate-800">Cartão</th>
                      <th className="p-4 border-b border-slate-800">Status</th>
                      <th className="p-4 border-b border-slate-800">Resposta API</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {cards.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-12 text-center text-slate-600 italic">
                          Nenhum cartão carregado para verificação.
                        </td>
                      </tr>
                    ) : (
                      cards.map((card) => (
                        <tr key={card.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-mono text-slate-300">{card.data}</td>
                          <td className="p-4">
                            {card.status === 'pending' && (
                              <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-xs">Aguardando</span>
                            )}
                            {card.status === 'checking' && (
                              <span className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-xs animate-pulse">Verificando...</span>
                            )}
                            {card.status === 'live' && (
                              <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" /> LIVE
                              </span>
                            )}
                            {card.status === 'dead' && (
                              <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3" /> DEAD
                              </span>
                            )}
                            {card.status === 'error' && (
                              <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center gap-1 w-fit">
                                <AlertCircle className="w-3 h-3" /> ERROR
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-500 italic text-xs">{card.response || '---'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardChecker;