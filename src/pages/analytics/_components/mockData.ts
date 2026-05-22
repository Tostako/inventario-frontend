export const monthlyRevenue = [
  { month: 'Ene', revenue: 8200000, orders: 142, avgTicket: 57746 },
  { month: 'Feb', revenue: 9100000, orders: 158, avgTicket: 57595 },
  { month: 'Mar', revenue: 7800000, orders: 131, avgTicket: 59542 },
  { month: 'Abr', revenue: 10500000, orders: 187, avgTicket: 56150 },
  { month: 'May', revenue: 11200000, orders: 201, avgTicket: 55721 },
  { month: 'Jun', revenue: 9800000, orders: 173, avgTicket: 56647 },
  { month: 'Jul', revenue: 12400000, orders: 219, avgTicket: 56621 },
  { month: 'Ago', revenue: 13100000, orders: 234, avgTicket: 55983 },
  { month: 'Sep', revenue: 11800000, orders: 208, avgTicket: 56731 },
  { month: 'Oct', revenue: 14200000, orders: 251, avgTicket: 56574 },
  { month: 'Nov', revenue: 15300000, orders: 272, avgTicket: 56250 },
  { month: 'Dic', revenue: 16800000, orders: 298, avgTicket: 56376 },
];

export const dailyOrders = [
  { day: 'Lun', orders: 38, revenue: 2140000 },
  { day: 'Mar', orders: 45, revenue: 2580000 },
  { day: 'Mié', orders: 42, revenue: 2410000 },
  { day: 'Jue', orders: 51, revenue: 2960000 },
  { day: 'Vie', orders: 67, revenue: 3820000 },
  { day: 'Sáb', orders: 72, revenue: 4150000 },
  { day: 'Dom', orders: 29, revenue: 1680000 },
];

export const hourlySales = [
  { hour: '6am', sales: 2 },
  { hour: '7am', sales: 5 },
  { hour: '8am', sales: 12 },
  { hour: '9am', sales: 18 },
  { hour: '10am', sales: 25 },
  { hour: '11am', sales: 32 },
  { hour: '12pm', sales: 28 },
  { hour: '1pm', sales: 35 },
  { hour: '2pm', sales: 30 },
  { hour: '3pm', sales: 22 },
  { hour: '4pm', sales: 26 },
  { hour: '5pm', sales: 38 },
  { hour: '6pm', sales: 42 },
  { hour: '7pm', sales: 45 },
  { hour: '8pm', sales: 20 },
  { hour: '9pm', sales: 8 },
];

export const paymentMethodsData = [
  { name: 'Efectivo', value: 45, amount: 6940000, color: '#10B981' },
  { name: 'Wompi', value: 28, amount: 4330000, color: '#3B82F6' },
  { name: 'Transferencia', value: 18, amount: 2770000, color: '#8B5CF6' },
  { name: 'Crédito', value: 9, amount: 1390000, color: '#F59E0B' },
];

export const topSellingProducts = [
  { name: 'Arroz 1kg', units: 342, revenue: 1197000, margin: 25 },
  { name: 'Aceite 1.5L', units: 287, revenue: 6888000, margin: 23 },
  { name: 'Leche 1L', units: 264, revenue: 1584000, margin: 20 },
  { name: 'Café 500g', units: 175, revenue: 6125000, margin: 26 },
  { name: 'Azúcar 1kg', units: 256, revenue: 1152000, margin: 22 },
  { name: 'Frijoles 500g', units: 198, revenue: 1683000, margin: 27 },
  { name: 'Pasta 500g', units: 165, revenue: 742500, margin: 29 },
  { name: 'Detergente 500g', units: 142, revenue: 1704000, margin: 26 },
];

export const newCustomersByMonth = [
  { month: 'Ene', newCustomers: 5 },
  { month: 'Feb', newCustomers: 8 },
  { month: 'Mar', newCustomers: 6 },
  { month: 'Abr', newCustomers: 11 },
  { month: 'May', newCustomers: 9 },
  { month: 'Jun', newCustomers: 7 },
  { month: 'Jul', newCustomers: 13 },
  { month: 'Ago', newCustomers: 10 },
  { month: 'Sep', newCustomers: 12 },
  { month: 'Oct', newCustomers: 15 },
  { month: 'Nov', newCustomers: 11 },
  { month: 'Dic', newCustomers: 14 },
];

export const categoryPerformance = [
  { name: 'Granos', sales: 3580000, percentage: 23, growth: 12, color: '#10B981' },
  { name: 'Bebidas', sales: 2730000, percentage: 18, growth: 8, color: '#3B82F6' },
  { name: 'Aceites', sales: 2080000, percentage: 13, growth: -3, color: '#8B5CF6' },
  { name: 'Lácteos', sales: 1920000, percentage: 12, growth: 15, color: '#EC4899' },
  { name: 'Limpieza', sales: 1680000, percentage: 11, growth: 6, color: '#F59E0B' },
  { name: 'Condimentos', sales: 1150000, percentage: 7, growth: 2, color: '#EF4444' },
  { name: 'Carnes', sales: 980000, percentage: 6, growth: -1, color: '#6366F1' },
  { name: 'Frutas/Verduras', sales: 1540000, percentage: 10, growth: 10, color: '#14B8A6' },
];

export const lowStockProducts = [
  { name: 'Azúcar 1kg', stock: 0, minStock: 15, category: 'Granos' },
  { name: 'Gaseosa 2.5L', stock: 0, minStock: 10, category: 'Bebidas' },
  { name: 'Café 500g', stock: 3, minStock: 8, category: 'Bebidas' },
  { name: 'Aceite 1.5L', stock: 12, minStock: 15, category: 'Aceites' },
  { name: 'Leche 1L', stock: 6, minStock: 12, category: 'Lácteos' },
  { name: 'Arroz 1kg', stock: 8, minStock: 20, category: 'Granos' },
];

export const kpiMetrics = [
  { title: 'Ingresos del mes', value: 16800000, previousValue: 15300000, change: 9.8, icon: 'dollar' as const, format: 'currency' as const, positive: true },
  { title: 'Pedidos del mes', value: 298, previousValue: 272, change: 9.6, icon: 'cart' as const, format: 'number' as const, positive: true },
  { title: 'Ticket promedio', value: 56376, previousValue: 56250, change: 0.2, icon: 'receipt' as const, format: 'currency' as const, positive: true },
  { title: 'Clientes nuevos', value: 14, previousValue: 11, change: 27.3, icon: 'users' as const, format: 'number' as const, positive: true },
  { title: 'Tasa conversión', value: 68, previousValue: 62, change: 9.7, icon: 'target' as const, format: 'percent' as const, positive: true },
  { title: 'Productos baja', value: 6, previousValue: 4, change: 50, icon: 'alert' as const, format: 'number' as const, positive: false },
];