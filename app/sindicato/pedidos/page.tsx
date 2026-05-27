'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search,
  Package,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  Filter,
  X,
  Clock,
  User,
  BarChart3,
  CheckCheck,
  Layers,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StockNotification {
  id: string;
  producerId: string;
  producerName: string;
  productId: string;
  productName: string;
  stockId: string;
  quantity: number;
  action: 'created' | 'updated';
  read: boolean;
  createdAt: string;
  isNew?: boolean;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export default function Abastecimento() {
  const [notifications, setNotifications] = useState<StockNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [searchProduct, setSearchProduct] = useState('');
  const [searchProducer, setSearchProducer] = useState('');
  const [filterAction, setFilterAction] = useState<'all' | 'created' | 'updated'>('all');
  const [newCount, setNewCount] = useState(0);
  const [totalToday, setTotalToday] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stock-notifications?limit=100`
      );
      if (response.ok) {
        const data: StockNotification[] = await response.json();

        setNotifications((prev) => {
          const existingIds = new Set(data.map((n) => n.id));
          const wsOnly = prev.filter((n) => !existingIds.has(n.id));
          const merged = [...wsOnly, ...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          return merged;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setTotalToday(
          data.filter((n) => new Date(n.createdAt) >= today).length
        );
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;

    setConnectionStatus('connecting');
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3333/ws';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (!mountedRef.current) { ws.close(); return; }
      setConnectionStatus('connected');
      ws.send(JSON.stringify({ type: 'join-company', payload: { companyId: 'sindicato' } }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'stock-notification') {
          const notification: StockNotification = data.payload;
          const enriched = { ...notification, isNew: true };
          setNotifications((prev) => {
            if (prev.some((n) => n.id === notification.id)) return prev;
            return [enriched, ...prev];
          });
          setNewCount((prev) => prev + 1);

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (new Date(notification.createdAt) >= today) {
            setTotalToday((prev) => prev + 1);
          }

          setTimeout(() => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === notification.id ? { ...n, isNew: false } : n))
            );
          }, 4000);
        }
      } catch {}
    };

    ws.onerror = () => {
      setConnectionStatus('disconnected');
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setConnectionStatus('disconnected');
      reconnectTimerRef.current = setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    fetchNotifications();
    connectWebSocket();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const markAllRead = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-notifications/mark-all-read`, {
        method: 'PATCH',
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setNewCount(0);
    } catch {}
  };

  const clearFilters = () => {
    setSearchProduct('');
    setSearchProducer('');
    setFilterAction('all');
  };

  const filtered = notifications.filter((n) => {
    const matchProduct = n.productName.toLowerCase().includes(searchProduct.toLowerCase());
    const matchProducer = n.producerName.toLowerCase().includes(searchProducer.toLowerCase());
    const matchAction = filterAction === 'all' || n.action === filterAction;
    return matchProduct && matchProducer && matchAction;
  });

  const hasActiveFilters = searchProduct || searchProducer || filterAction !== 'all';

  const uniqueProducers = [...new Set(notifications.map((n) => n.producerName))].length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Abastecimento em Tempo Real</h1>
              <p className="text-sm text-gray-500">Monitoramento contínuo de estoques dos produtores</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              connectionStatus === 'connected'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {connectionStatus === 'connected' ? (
                <><Wifi className="w-3.5 h-3.5" /><span>Ao vivo</span><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /></>
              ) : connectionStatus === 'connecting' ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Conectando...</span></>
              ) : (
                <><WifiOff className="w-3.5 h-3.5" /><span>Desconectado</span></>
              )}
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllRead}
                className="gap-2 text-xs h-8"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas como lidas
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={fetchNotifications}
              className="gap-2 text-xs h-8"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Hoje</p>
                  <p className="text-2xl font-bold text-green-800 mt-0.5">{totalToday}</p>
                  <p className="text-xs text-green-600 mt-0.5">atualizações</p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold text-blue-800 mt-0.5">{notifications.length}</p>
                  <p className="text-xs text-blue-600 mt-0.5">registros</p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Produtores</p>
                  <p className="text-2xl font-bold text-purple-800 mt-0.5">{uniqueProducers}</p>
                  <p className="text-xs text-purple-600 mt-0.5">ativos</p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-700 font-medium uppercase tracking-wide">Não lidas</p>
                  <p className="text-2xl font-bold text-orange-800 mt-0.5">{unreadCount}</p>
                  <p className="text-xs text-orange-600 mt-0.5">pendentes</p>
                </div>
                <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0 mt-2 sm:mt-0" />

              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Filtrar por produto..."
                  className="pl-9 h-9 text-sm bg-gray-50"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
              </div>

              <div className="relative flex-1 min-w-0">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Filtrar por produtor..."
                  className="pl-9 h-9 text-sm bg-gray-50"
                  value={searchProducer}
                  onChange={(e) => setSearchProducer(e.target.value)}
                />
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {(['all', 'created', 'updated'] as const).map((action) => (
                  <button
                    key={action}
                    onClick={() => setFilterAction(action)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filterAction === action
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {action === 'all' ? 'Todos' : action === 'created' ? 'Novos' : 'Atualizados'}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpar
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Entries List */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-green-700" />
                Entradas de Estoque
                <Badge variant="secondary" className="text-xs font-normal">
                  {filtered.length}
                </Badge>
              </CardTitle>

              {newCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {newCount} nova{newCount !== 1 ? 's' : ''} entrada{newCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Carregando entradas...</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  {hasActiveFilters ? 'Nenhum resultado encontrado' : 'Aguardando entradas'}
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  {hasActiveFilters
                    ? 'Tente ajustar ou limpar os filtros aplicados.'
                    : 'Quando produtores adicionarem ou atualizarem estoques, as entradas aparecerão aqui em tempo real.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 px-5 py-4 transition-all duration-500 ${
                      notification.isNew
                        ? 'bg-green-50 border-l-4 border-l-green-500'
                        : !notification.read
                        ? 'bg-amber-50/40 border-l-4 border-l-amber-400'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Action Icon */}
                    <div
                      className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.action === 'created'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {notification.action === 'created' ? (
                        <Package className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {notification.productName}
                        </span>
                        <Badge
                          className={`text-xs px-2 py-0 ${
                            notification.action === 'created'
                              ? 'bg-blue-100 text-blue-700 border-0'
                              : 'bg-orange-100 text-orange-700 border-0'
                          }`}
                        >
                          {notification.action === 'created' ? 'Novo estoque' : 'Atualizado'}
                        </Badge>
                        {notification.isNew && (
                          <Badge className="text-xs px-2 py-0 bg-green-500 text-white border-0 animate-pulse">
                            Novo
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{notification.producerName}</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-gray-800">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                          <span>{notification.quantity} unidades</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span>
                          {format(new Date(notification.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Quantity highlight */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xl font-bold text-green-700">
                        {notification.quantity}
                      </div>
                      <div className="text-xs text-gray-400">unid.</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
