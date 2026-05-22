export const revenueData = [
  { month: 'Ene', revenue: 8200000, orders: 142 },
  { month: 'Feb', revenue: 9100000, orders: 158 },
  { month: 'Mar', revenue: 7800000, orders: 131 },
  { month: 'Abr', revenue: 10500000, orders: 187 },
  { month: 'May', revenue: 11200000, orders: 201 },
  { month: 'Jun', revenue: 9800000, orders: 173 },
  { month: 'Jul', revenue: 12400000, orders: 219 },
  { month: 'Ago', revenue: 13100000, orders: 234 },
  { month: 'Sep', revenue: 11800000, orders: 208 },
  { month: 'Oct', revenue: 14200000, orders: 251 },
  { month: 'Nov', revenue: 15300000, orders: 272 },
  { month: 'Dic', revenue: 16800000, orders: 298 },
];

export const weeklyRevenue = [
  { day: 'Lun', revenue: 2450000 },
  { day: 'Mar', revenue: 3120000 },
  { day: 'Mié', revenue: 2890000 },
  { day: 'Jue', revenue: 3560000 },
  { day: 'Vie', revenue: 4100000 },
  { day: 'Sáb', revenue: 3800000 },
  { day: 'Dom', revenue: 2100000 },
];

export const orderStatusData = [
  { name: 'Completados', value: 156, color: '#10B981' },
  { name: 'En proceso', value: 43, color: '#3B82F6' },
  { name: 'Pendientes', value: 28, color: '#F59E0B' },
  { name: 'Cancelados', value: 7, color: '#EF4444' },
];

export const topProducts = [
  { name: 'Arroz 1kg', sales: 342, revenue: 5130000 },
  { name: 'Aceite 1.5L', sales: 287, revenue: 6888000 },
  { name: 'Azúcar 1kg', sales: 256, revenue: 3072000 },
  { name: 'Frijoles 500g', sales: 198, revenue: 1683000 },
  { name: 'Café 500g', sales: 175, revenue: 6125000 },
  { name: 'Leche 1L', sales: 164, revenue: 984000 },
];

export const salesByCategory = [
  { name: 'Granos', value: 35, color: '#10B981' },
  { name: 'Aceites', value: 20, color: '#3B82F6' },
  { name: 'Bebidas', value: 18, color: '#8B5CF6' },
  { name: 'Condimentos', value: 12, color: '#F59E0B' },
  { name: 'Lácteos', value: 10, color: '#EC4899' },
  { name: 'Otros', value: 5, color: '#6B7280' },
];

export const recentOrders = [
  { id: 'ORD-2345', customer: 'María García', email: 'maria@email.com', total: 245000, status: 'completed', date: '2024-01-15', items: 5 },
  { id: 'ORD-2344', customer: 'Carlos López', email: 'carlos@email.com', total: 178000, status: 'pending', date: '2024-01-15', items: 3 },
  { id: 'ORD-2343', customer: 'Ana Martínez', email: 'ana@email.com', total: 512000, status: 'processing', date: '2024-01-14', items: 8 },
  { id: 'ORD-2342', customer: 'Pedro Sánchez', email: 'pedro@email.com', total: 89000, status: 'completed', date: '2024-01-14', items: 2 },
  { id: 'ORD-2341', customer: 'Laura Torres', email: 'laura@email.com', total: 134000, status: 'completed', date: '2024-01-13', items: 4 },
  { id: 'ORD-2340', customer: 'Roberto Díaz', email: 'roberto@email.com', total: 356000, status: 'pending', date: '2024-01-13', items: 6 },
];

export const activityFeed = [
  { id: 1, type: 'order' as const, message: 'Nuevo pedido ORD-2345 de María García', time: 'Hace 5 min' },
  { id: 2, type: 'stock' as const, message: 'Stock bajo: Azúcar 1kg (3 unidades)', time: 'Hace 15 min' },
  { id: 3, type: 'order' as const, message: 'Pedido ORD-2343 marcado como en proceso', time: 'Hace 30 min' },
  { id: 4, type: 'customer' as const, message: 'Nuevo cliente registrado: Laura Torres', time: 'Hace 1 hora' },
  { id: 5, type: 'payment' as const, message: 'Pago recibido: $245.000 de ORD-2345', time: 'Hace 2 horas' },
  { id: 6, type: 'stock' as const, message: 'Stock bajo: Café 500g (3 unidades)', time: 'Hace 3 horas' },
];

export const kpiStats = [
  {
    title: 'Ventas totales',
    value: 15432000,
    previousValue: 13710000,
    change: 12.5,
    positive: true,
    icon: 'dollar' as const,
    format: 'currency' as const,
  },
  {
    title: 'Pedidos',
    value: 234,
    previousValue: 216,
    change: 8.2,
    positive: true,
    icon: 'cart' as const,
    format: 'number' as const,
  },
  {
    title: 'Productos activos',
    value: 156,
    previousValue: 161,
    change: -3.1,
    positive: false,
    icon: 'package' as const,
    format: 'number' as const,
  },
  {
    title: 'Clientes',
    value: 89,
    previousValue: 77,
    change: 15.3,
    positive: true,
    icon: 'users' as const,
    format: 'number' as const,
  },
  {
    title: 'Ticket promedio',
    value: 65948,
    previousValue: 63400,
    change: 4.0,
    positive: true,
    icon: 'receipt' as const,
    format: 'currency' as const,
  },
  {
    title: 'Tasa conversión',
    value: 68,
    previousValue: 62,
    change: 9.7,
    positive: true,
    icon: 'target' as const,
    format: 'percent' as const,
  },
];