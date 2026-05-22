import { useEffect, useState, useRef } from 'react';
import { Store, User, Bell, Shield, Save, Check, Upload, Info, Trash2, AlertTriangle } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { useShop } from '@/hooks/useShop';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useDeleteShop } from '@/hooks/useDeleteShop';
import { useUpdateShopLogo } from '@/hooks/useUpdateShopLogo';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'store', label: 'Tienda', icon: Store },
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'security', label: 'Seguridad', icon: Shield },
];

// Mock notifications data (non-functional table)
const mockNotifications = [
  { id: '1', title: 'Pedido nuevo', message: 'Nuevo pedido #ORD-2345 recibido', type: 'order', read: false, created_at: '2024-01-15T14:30:00Z' },
  { id: '2', title: 'Stock bajo', message: 'El producto "Arroz 1kg" tiene solo 2 unidades', type: 'inventory', read: false, created_at: '2024-01-15T10:15:00Z' },
  { id: '3', title: 'Pago confirmado', message: 'Pago del pedido #ORD-2343 confirmado', type: 'payment', read: true, created_at: '2024-01-14T09:20:00Z' },
  { id: '4', title: 'Nuevo cliente', message: 'Carlos López se ha registrado', type: 'customer', read: true, created_at: '2024-01-13T16:00:00Z' },
  { id: '5', title: 'Pedido cancelado', message: 'El pedido #ORD-2340 fue cancelado', type: 'order', read: true, created_at: '2024-01-13T18:30:00Z' },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('store');
  const { shop, fetchShop, updateShop, isLoading: shopLoading } = useShop();
  const { profile, fetchProfile, updateProfile, changePassword, isLoading: profileLoading } = useUserProfile();
  const { deleteShop, isLoading: deletingShop, error: deleteError } = useDeleteShop();
  const { updateLogo, isLoading: logoLoading } = useUpdateShopLogo();
  const { user, logout, setAuth, selectShop } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [shopForm, setShopForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    currency: 'COP',
    timezone: 'America/Bogota',
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchShop();
    fetchProfile();
  }, [fetchShop, fetchProfile]);

  useEffect(() => {
    if (shop) {
      setShopForm({
        name: shop.name || '',
        email: shop.email || '',
        phone: shop.phone || '',
        address: shop.address || '',
        description: shop.description || '',
        currency: shop.currency || 'COP',
        timezone: shop.timezone || 'America/Bogota',
      });
      setLogoPreview(shop.logo_url || null);
    }
  }, [shop]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSaveShop = async () => {
    try {
      await updateShop(shopForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const handleDeleteShop = async () => {
    try {
      const result = await deleteShop();
      setShowDeleteConfirm(false);

      // El backend ahora es inteligente: si tiene otra tienda,
      // devuelve token + shop nuevos directamente.
      if (result?.token && result?.shop) {
        localStorage.setItem('token', result.token);
        if (user) {
          setAuth(user, result.token);
          selectShop(result.shop);
        }
        // Recargar para que todos los hooks carguen datos de la nueva tienda
        window.location.reload();
      } else {
        // No hay más tiendas: cerrar sesión
        logout();
        navigate('/login');
      }
    } catch {
      // Error se muestra en deleteError
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local inmediato
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      await updateLogo(file);
      // Refrescar datos de la tienda para obtener la URL oficial
      await fetchShop();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Error se maneja en el hook
    }
  };

  const isLoading = shopLoading || profileLoading;

  if (isLoading && !shop && !profile) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[--color-text-primary]">Configuración</h1>
        <p className="text-[--color-text-muted]">Gestiona los ajustes de tu tienda y perfil</p>
      </div>

      {/* Tabs */}
      <div className="bg-[#F3F4F6] rounded-[--radius-xl] p-1.5 flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[--radius-lg] transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[--color-text-primary] shadow-sm'
                : 'text-[--color-text-muted] hover:text-[--color-text-primary]'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[--color-bg-surface] rounded-[--radius-xl] shadow-sm">
        {activeTab === 'store' && (
          <div className="p-6 space-y-6">
            {/* Información de la Tienda */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Store className="h-5 w-5 text-[--color-text-muted]" />
                <h2 className="text-base font-semibold text-[--color-text-primary]">Información de la Tienda</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Nombre Comercial *</label>
                  <input
                    type="text"
                    value={shopForm.name}
                    onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Descripción</label>
                  <textarea
                    rows={3}
                    value={shopForm.description}
                    onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Email de Contacto *</label>
                    <input
                      type="email"
                      value={shopForm.email}
                      onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Teléfono *</label>
                    <input
                      type="text"
                      value={shopForm.phone}
                      onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Dirección</label>
                  <input
                    type="text"
                    value={shopForm.address}
                    onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-2">Logo de la Tienda</label>
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => !logoLoading && fileInputRef.current?.click()}
                      className={`relative w-16 h-16 rounded-[--radius-md] bg-[#F3F4F6] flex items-center justify-center text-2xl font-bold text-[--color-accent] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group ${logoLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="transition-transform duration-300 group-hover:scale-110">{(shop?.name || 'T').charAt(0)}</span>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Upload className="h-5 w-5 text-white" />
                      </div>
                      {/* Loading spinner */}
                      {logoLoading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-[--color-accent] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={logoLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-[--radius-md] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
                      >
                        <Upload className="h-4 w-4" />
                        {logoLoading ? 'Subiendo...' : 'Cambiar Logo'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <p className="text-xs text-[--color-text-muted]">JPG, PNG, WEBP. Máx 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop ID */}
            <div className="bg-green-50 rounded-[--radius-lg] p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">ID de Tienda (Shop ID)</p>
              </div>
              <p className="text-sm font-mono text-green-700 bg-white inline-block px-2 py-1 rounded border border-green-200">
                {shop?.slug || 'sin-slug'}
              </p>
              <p className="text-xs text-green-600 mt-2">Este identificador único aísla tus datos del resto de tiendas en la plataforma.</p>
            </div>

            {/* Configuración regional */}
            <div className="border-t border-[--color-bg-hover] pt-6">
              <h3 className="text-sm font-semibold text-[--color-text-primary] mb-4">Configuración regional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Moneda</label>
                  <select
                    value={shopForm.currency}
                    onChange={(e) => setShopForm({ ...shopForm, currency: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="COP">COP - Peso colombiano</option>
                    <option value="USD">USD - Dólar americano</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Zona horaria</label>
                  <select
                    value={shopForm.timezone}
                    onChange={(e) => setShopForm({ ...shopForm, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="America/Bogota">América/Bogotá (UTC-5)</option>
                    <option value="America/Mexico_City">América/México City (UTC-6)</option>
                    <option value="America/Lima">América/Lima (UTC-5)</option>
                    <option value="America/Santiago">América/Santiago (UTC-4)</option>
                    <option value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guardar */}
            <div className="pt-2">
              <Button
                onClick={handleSaveShop}
                isLoading={shopLoading}
                className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-[--radius-lg] font-medium"
              >
                {saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {saved ? 'Guardado' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-[--color-text-muted]" />
              <h2 className="text-base font-semibold text-[--color-text-primary]">Perfil personal</h2>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-2xl font-bold text-[--color-accent]">
                {(profile?.name || user?.name || '?').charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[--color-text-primary]">{profile?.name || user?.name || 'Usuario'}</p>
                <p className="text-sm text-[--color-text-muted]">{profile?.email || user?.email}</p>
                <p className="text-xs text-[--color-text-muted] capitalize">{profile?.role || user?.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Nombre</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Teléfono</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <div className="border-t border-[--color-bg-hover] pt-6">
              <h3 className="text-sm font-semibold text-[--color-text-primary] mb-4">Cambiar contraseña</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Contraseña actual</label>
                  <input
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                <div />
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Nueva contraseña</label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F4F6] rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="secondary" onClick={handleChangePassword} isLoading={profileLoading}>
                  Cambiar contraseña
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSaveProfile}
                isLoading={profileLoading}
                className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-[--radius-lg] font-medium"
              >
                {saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {saved ? 'Guardado' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="h-5 w-5 text-[--color-text-muted]" />
              <h2 className="text-base font-semibold text-[--color-text-primary]">Notificaciones</h2>
            </div>

            {/* Non-functional notifications table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F3F4F6]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider rounded-tl-[--radius-lg]">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Notificación</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider rounded-tr-[--radius-lg]">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {mockNotifications.map((n, i) => (
                    <tr key={n.id} className={`hover:bg-[--color-bg-hover] transition-colors ${i !== mockNotifications.length - 1 ? '' : ''}`}>
                      <td className="px-4 py-3">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                      </td>
                      <td className="px-4 py-3">
                        <p className={`text-sm font-medium ${n.read ? 'text-[--color-text-muted]' : 'text-[--color-text-primary]'}`}>{n.title}</p>
                        <p className="text-xs text-[--color-text-muted]">{n.message}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 capitalize">
                          {n.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[--color-text-muted]">
                        {new Date(n.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-[--radius-md] text-sm text-yellow-700">
              <p className="font-medium">Vista previa de notificaciones</p>
              <p className="text-yellow-600">Esta tabla muestra datos de ejemplo. Conecta con el backend para notificaciones reales.</p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-[--color-text-muted]" />
              <h2 className="text-base font-semibold text-[--color-text-primary]">Seguridad de la cuenta</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[--color-bg-hover]">
                <div>
                  <p className="text-sm font-medium text-[--color-text-primary]">Autenticación de dos factores</p>
                  <p className="text-xs text-[--color-text-muted]">Agrega una capa extra de seguridad a tu cuenta</p>
                </div>
                <Button variant="secondary" size="sm">Configurar</Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[--color-bg-hover]">
                <div>
                  <p className="text-sm font-medium text-[--color-text-primary]">Sesiones activas</p>
                  <p className="text-xs text-[--color-text-muted]">Administra los dispositivos donde estás conectado</p>
                </div>
                <Button variant="secondary" size="sm">Ver sesiones</Button>
              </div>
            </div>

            {/* Delete shop section */}
            <div className="mt-8">
              <div className="bg-red-50 border border-red-100 rounded-[--radius-lg] p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800">Eliminar tienda</h3>
                    <p className="text-xs text-red-600 mt-1">
                      Esta acción eliminará permanentemente tu tienda "{shop?.name || ''}", todos sus productos, pedidos y datos asociados.
                      Esta acción no se puede deshacer.
                    </p>
                    {user?.role === 'owner' && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="mt-3"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar tienda
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[--color-bg-surface] rounded-[--radius-xl] shadow-lg w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[--color-text-primary]">¿Eliminar tienda?</h3>
                <p className="text-sm text-[--color-text-muted]">{shop?.name}</p>
              </div>
            </div>

            <p className="text-sm text-[--color-text-muted] mb-4">
              Esta acción es irreversible. Se eliminarán todos los productos, pedidos, clientes y configuraciones de esta tienda.
            </p>

            {deleteError && (
              <div className="bg-red-50 rounded-[--radius-md] p-3 text-sm text-red-600 mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deletingShop}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteShop} isLoading={deletingShop}>
                <Trash2 className="h-4 w-4 mr-1" />
                Sí, eliminar tienda
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
