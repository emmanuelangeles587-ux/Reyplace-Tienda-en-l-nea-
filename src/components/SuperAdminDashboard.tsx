import React, { useState } from 'react';
import { ShieldAlert, Package, TrendingUp, Users, Activity, Lock, Unlock, RefreshCw, CheckCircle, AlertTriangle, Search, X } from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';

interface SuperAdminDashboardProps {
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export function SuperAdminDashboard({ onClose, onTriggerToast }: SuperAdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<'analytics' | 'inventory' | 'clients'>('analytics');
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mock customer security nodes
  const [clientNodes, setClientNodes] = useState([
    { id: 'node-01', client: 'Dr. Roberto Mendoza', location: 'Fracc. Las Quintas, Los Mochis', status: 'Online', signal: '-64 dBm', battery: '98%', armed: true, lastPing: 'Hace 4s' },
    { id: 'node-02', client: 'Ing. Sofía Valenzuela', location: 'Centro, Los Mochis', status: 'Online', signal: '-58 dBm', battery: '100%', armed: true, lastPing: 'Hace 12s' },
    { id: 'node-03', client: 'Lic. Carlos Cota', location: 'Topolobampo Puerto', status: 'Warning', signal: '-82 dBm', battery: '34%', armed: false, lastPing: 'Hace 2m' },
    { id: 'node-04', client: 'Residencial Alameda', location: 'Los Mochis, Sinaloa', status: 'Online', signal: '-51 dBm', battery: '92%', armed: true, lastPing: 'Hace 1s' },
  ]);

  const handleStockChange = (productId: string, delta: number) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, (p.stock || 25) + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    onTriggerToast('Inventario actualizado en tiempo real');
  };

  const filteredProducts = productList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl w-full neo-surface rounded-3xl border border-rose-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Centro de Control SuperAdmin · REYPLACE.MX
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 font-mono-num">
                  Nivel 5 · Privilegiado
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestión global de inventario, analíticas de ventas y telemetría de nodos de seguridad en Sinaloa.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl neo-inset flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 gap-3 bg-slate-900/50">
          <button
            type="button"
            onClick={() => setAdminTab('analytics')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              adminTab === 'analytics'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Analíticas Globales
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('inventory')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              adminTab === 'inventory'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" /> Gestión de Inventario
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('clients')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              adminTab === 'clients'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" /> Monitoreo de Nodos (En Vivo)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {adminTab === 'analytics' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="neo-inset p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-slate-400">Ventas Totales (Mes)</p>
                  <p className="text-xl font-bold font-mono-num text-emerald-500">$842,590 MXN</p>
                  <p className="text-[10px] text-emerald-400">+18.4% vs mes anterior</p>
                </div>
                <div className="neo-inset p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-slate-400">Órdenes Procesadas</p>
                  <p className="text-xl font-bold font-mono-num text-cyan-400">142</p>
                  <p className="text-[10px] text-cyan-300">Promedio $5,930 MXN</p>
                </div>
                <div className="neo-inset p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-slate-400">Clientes Activos Sinaloa</p>
                  <p className="text-xl font-bold font-mono-num text-amber-400">1,280</p>
                  <p className="text-[10px] text-amber-300">89% Nivel Oro/Plata</p>
                </div>
                <div className="neo-inset p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-slate-400">Uptime Sistemas</p>
                  <p className="text-xl font-bold font-mono-num text-emerald-400">99.98%</p>
                  <p className="text-[10px] text-emerald-300">Servidor Los Mochis Node</p>
                </div>
              </div>

              {/* Regional Sales Breakdown */}
              <div className="neo-surface p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Desglose de Ventas por Región (Estado de Sinaloa)
                </h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Los Mochis (Centro y Residencial)</span>
                      <span className="font-mono-num font-bold">58% ($488,700 MXN)</span>
                    </div>
                    <div className="w-full h-2 neo-inset rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full w-[58%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Culiacán Rosales</span>
                      <span className="font-mono-num font-bold">24% ($202,220 MXN)</span>
                    </div>
                    <div className="w-full h-2 neo-inset rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[24%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Mazatlán Zona Dorada</span>
                      <span className="font-mono-num font-bold">18% ($151,670 MXN)</span>
                    </div>
                    <div className="w-full h-2 neo-inset rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[18%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar producto en inventario..."
                    className="w-full neo-inset rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onTriggerToast('Sincronización de inventario con almacén central completada')}
                  className="px-4 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold flex items-center gap-2 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sincronizar Almacén
                </button>
              </div>

              <div className="space-y-2">
                {filteredProducts.map((p) => {
                  const stock = p.stock || 24;
                  const isLowStock = stock < 5;
                  return (
                    <div
                      key={p.id}
                      className={`neo-surface p-3.5 rounded-2xl flex items-center justify-between gap-4 ${isLowStock ? 'border-2 border-rose-500 animate-pulse' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover neo-inset"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {p.name}
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            {p.category} · ${p.price.toLocaleString('es-MX')} MXN
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={`text-xs font-bold font-mono-num px-2.5 py-1 rounded-xl ${isLowStock ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                            Stock: {stock} u.
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isLowStock && (
                              <button
                                type="button"
                                onClick={() => handleStockChange(p.id, 10)}
                                className="w-20 h-8 rounded-xl bg-rose-600 text-white text-xs font-bold"
                              >
                                Restock
                              </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleStockChange(p.id, -1)}
                            className="w-8 h-8 rounded-xl neo-inset flex items-center justify-center text-xs font-bold"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockChange(p.id, 5)}
                            className="w-8 h-8 rounded-xl neo-inset flex items-center justify-center text-xs font-bold"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {adminTab === 'clients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Telemetría y Conexión de Nodos Residenciales (En Vivo)
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono-num flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> WebSocket Seguro Activo
                </span>
              </div>

              <div className="space-y-3">
                {clientNodes.map((node) => (
                  <div key={node.id} className="neo-surface p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${node.status === 'Online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {node.status === 'Online' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {node.client} ({node.id})
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          {node.location} · {node.lastPing}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-mono-num">
                      <div>
                        <p className="text-[10px] text-slate-400">Señal</p>
                        <p className="font-bold text-cyan-400">{node.signal}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Batería</p>
                        <p className="font-bold text-emerald-400">{node.battery}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Estado Alarma</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${node.armed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                          {node.armed ? 'Armado' : 'Desarmado'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-900/40 flex justify-between items-center text-xs text-slate-400">
          <span>Conectado al servidor principal REYPLACE.MX · Los Mochis</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Cerrar SuperAdmin
          </button>
        </div>
      </div>
    </div>
  );
}
