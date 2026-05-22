import { useState, useMemo, useEffect } from 'react';
import { Package, Zap, TrendingDown, Save, Check, Trash2, AlertCircle, Percent, Tag } from 'lucide-react';
import { Button, Badge, Spinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useOffers } from '@/hooks/useOffers';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/product.types';
import type { Offer } from '@/types/offer.types';

interface ProductOfferConfig {
  discountPercent: number;
  offerId?: string;
}

export function OffersPage() {
  const { offers, isLoading: offersLoading, fetchOffers, createOffer, updateOffer, deleteOffer } = useOffers();
  const { products, isLoading: productsLoading, fetchProducts } = useProducts();

  const [configs, setConfigs] = useState<Record<string, ProductOfferConfig>>({});
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const isLoading = offersLoading || productsLoading;

  // Cargar productos y ofertas
  useEffect(() => {
    fetchProducts();
    fetchOffers({ scope: 'product', limit: 100 });
  }, [fetchProducts, fetchOffers]);

  // Mapear ofertas existentes a productos
  const offerByProduct = useMemo(() => {
    const map: Record<string, Offer> = {};
    offers.forEach((o) => {
      if (o.scope === 'product' && o.product_id) {
        map[o.product_id] = o;
      }
    });
    return map;
  }, [offers]);

  // Productos activos con stock > stock_min
  const eligibleProducts = useMemo(() => {
    return products
      .filter((p) => p.is_active && p.stock > p.stock_min)
      .sort((a, b) => b.stock - a.stock);
  }, [products]);

  // Inicializar configs con ofertas existentes
  useEffect(() => {
    const initial: Record<string, ProductOfferConfig> = {};
    eligibleProducts.forEach((p) => {
      const existing = offerByProduct[p.id];
      if (existing) {
        initial[p.id] = {
          discountPercent: existing.discount_value,
          offerId: existing.id,
        };
      } else {
        initial[p.id] = { discountPercent: 20 };
      }
    });
    // Solo inicializar si configs está vacío para no sobreescribir ediciones del usuario
    setConfigs((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      return initial;
    });
  }, [eligibleProducts, offerByProduct]);

  const setDiscount = (productId: string, value: number) => {
    setConfigs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], discountPercent: Math.max(0, Math.min(99, value)) },
    }));
  };

  const handleSaveOffer = async (product: Product) => {
    const config = configs[product.id];
    if (!config) return;

    setSavingProductId(product.id);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      if (config.discountPercent <= 0) {
        // Si descuento es 0, eliminar oferta si existe
        if (config.offerId) {
          await deleteOffer(config.offerId);
          setConfigs((prev) => ({
            ...prev,
            [product.id]: { discountPercent: 20 },
          }));
        }
        setSaveSuccess(`Oferta eliminada de ${product.name}`);
      } else if (config.offerId) {
        // Actualizar oferta existente
        await updateOffer(config.offerId, {
          discount_value: config.discountPercent,
          is_active: true,
        });
        setSaveSuccess(`Oferta actualizada: ${product.name} -${config.discountPercent}%`);
      } else {
        // Crear nueva oferta
        const now = new Date();
        const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const newOffer = await createOffer({
          title: `Oferta: ${product.name}`,
          description: `Descuento del ${config.discountPercent}% en ${product.name}`,
          discount_type: 'percentage',
          discount_value: config.discountPercent,
          scope: 'product',
          product_id: product.id,
          starts_at: now.toISOString(),
          ends_at: end.toISOString(),
          is_active: true,
        });
        setConfigs((prev) => ({
          ...prev,
          [product.id]: { ...prev[product.id], offerId: newOffer?.id },
        }));
        setSaveSuccess(`¡Oferta creada! ${product.name} -${config.discountPercent}%`);
      }

      // Refrescar ofertas para sincronizar estado
      await fetchOffers({ scope: 'product', limit: 100 });
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Error al guardar oferta');
    } finally {
      setSavingProductId(null);
      setTimeout(() => {
        setSaveSuccess(null);
        setSaveError(null);
      }, 3000);
    }
  };

  const handleDeleteOffer = async (product: Product) => {
    const config = configs[product.id];
    if (!config?.offerId) return;

    setSavingProductId(product.id);
    setSaveError(null);
    try {
      await deleteOffer(config.offerId);
      setConfigs((prev) => ({
        ...prev,
        [product.id]: { discountPercent: 20 },
      }));
      setSaveSuccess(`Oferta eliminada de ${product.name}`);
      await fetchOffers({ scope: 'product', limit: 100 });
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Error al eliminar');
    } finally {
      setSavingProductId(null);
      setTimeout(() => {
        setSaveSuccess(null);
        setSaveError(null);
      }, 3000);
    }
  };

  const activeOfferCount = useMemo(() => {
    return offers.filter((o) => o.scope === 'product' && o.is_active).length;
  }, [offers]);

  const calculateOfferPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[28px] font-bold text-[--color-text-primary] tracking-tight">Ofertas</h1>
          <p className="text-[15px] text-[--color-text-muted] mt-1">Selecciona productos y asígnales descuento</p>
        </div>
        <div className="py-16 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[--color-text-primary] tracking-tight">Ofertas</h1>
          <p className="text-[15px] text-[--color-text-muted] mt-1">
            Selecciona productos y asígnales un descuento
          </p>
        </div>
        <Badge variant="success" className="px-3 py-1.5 self-start">
          <Zap className="h-3.5 w-3.5 mr-1" />
          {activeOfferCount} productos en oferta
        </Badge>
      </div>

      {/* Alertas */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[--radius-xl] px-4 py-3 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-700">{saveSuccess}</p>
        </div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-[--radius-xl] px-4 py-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-sm font-medium text-red-700">{saveError}</p>
        </div>
      )}

      {/* Info */}
      {eligibleProducts.length === 0 && !isLoading && (
        <div className="bg-blue-50 rounded-[--radius-xl] p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">No hay productos elegibles</p>
            <p className="text-sm text-blue-600 mt-0.5">
              Necesitas productos activos con stock mayor al mínimo para crear ofertas.
            </p>
          </div>
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products
          .filter((p) => p.is_active)
          .sort((a, b) => b.stock - a.stock)
          .map((product) => {
            const config = configs[product.id] || { discountPercent: 20 };
            const hasOffer = !!config.offerId && config.discountPercent > 0;
            const offerPrice = calculateOfferPrice(product.price, config.discountPercent);
            const savings = product.price - offerPrice;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-[--radius-xl] shadow-sm border-2 transition-all duration-200 overflow-hidden ${
                  hasOffer ? 'border-emerald-400 shadow-md' : 'border-transparent hover:border-gray-200'
                }`}
              >
                {/* Imagen */}
                <div className="relative h-44 bg-gray-50 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-[--radius-md] bg-white flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold text-[--color-accent]">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {hasOffer && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="success" className="shadow-sm text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        En oferta
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={product.stock <= product.stock_min ? 'warning' : 'neutral'}
                      className="shadow-sm text-xs"
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-[--color-text-primary] text-sm leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[--color-text-muted] mt-0.5">{product.sku}</p>
                  </div>

                  {/* Precios */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {hasOffer || config.discountPercent > 0 ? (
                      <>
                        <span className="text-lg font-bold text-emerald-600">
                          {formatCurrency(offerPrice)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                        <Badge variant="success" className="text-xs">
                          -{config.discountPercent}%
                        </Badge>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-[--color-text-primary]">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>

                  {(hasOffer || config.discountPercent > 0) && savings > 0 && (
                    <p className="text-xs text-emerald-600 font-medium">
                      Ahorro: {formatCurrency(savings)}
                    </p>
                  )}

                  {/* Input descuento */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[--color-text-muted]">Descuento:</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={config.discountPercent}
                        onChange={(e) => setDiscount(product.id, Number(e.target.value))}
                        className="w-16 px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-[--radius-md] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-green-500/20 text-center font-medium"
                      />
                      <span className="text-xs text-[--color-text-muted]">%</span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1 text-xs"
                      isLoading={savingProductId === product.id}
                      onClick={() => handleSaveOffer(product)}
                    >
                      {savingProductId === product.id ? (
                        'Guardando...'
                      ) : hasOffer ? (
                        <>
                          <Save className="h-3.5 w-3.5 mr-1" />
                          Actualizar
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5 mr-1" />
                          Crear oferta
                        </>
                      )}
                    </Button>
                    {hasOffer && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="px-2"
                        isLoading={savingProductId === product.id}
                        onClick={() => handleDeleteOffer(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {products.filter((p) => p.is_active).length === 0 && !isLoading && (
        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-8 text-center shadow-sm">
          <Package className="h-12 w-12 text-[--color-text-muted] mx-auto mb-3" />
          <p className="text-[--color-text-primary] font-medium">No hay productos activos</p>
          <p className="text-sm text-[--color-text-muted] mt-1">
            Crea productos primero para poder asignarles ofertas.
          </p>
        </div>
      )}
    </div>
  );
}
