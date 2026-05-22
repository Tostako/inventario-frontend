import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Box } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { useCategories } from '@/hooks/useCategories';
import { CategoryFormModal } from './_components/CategoryFormModal';
import { DeleteConfirmModal } from './_components/DeleteConfirmModal';
import type { Category, CategoryFormData } from '@/types/category.types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = useMemo(() => {
    let result = [...categories];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [categories, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeCount = categories.filter((c) => c.is_active).length;
  const inactiveCount = categories.length - activeCount;

  const handleCreate = async (data: CategoryFormData) => {
    setCreateError(null);
    try {
      await createCategory(data);
      setShowCreateModal(false);
      setCreateError(null);
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || err?.message || 'Error al crear la categoría');
    }
  };

  const handleEdit = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    setEditError(null);
    try {
      // Ahora updateCategory maneja JSON o FormData con imagen en una sola llamada
      await updateCategory(editingCategory.id, data);
      setEditingCategory(null);
      setEditError(null);
    } catch (err: any) {
      setEditError(err?.response?.data?.message || err?.message || 'Error al actualizar la categoría');
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    await deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[--color-text-primary] tracking-tight">Categorías</h1>
          <p className="text-[15px] text-[--color-text-muted] mt-1">Gestiona las categorías de tu tienda</p>
        </div>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[--color-text-muted]">Total Categorías</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{categories.length}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-lg] bg-blue-100">
              <Box className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[--color-text-muted]">Activas</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{activeCount}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-lg] bg-green-100">
              <Box className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[--color-text-muted]">Inactivas</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{inactiveCount}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-lg] bg-slate-100">
              <Box className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-text-subtle]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar categorías..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[--color-bg-elevated] rounded-[--radius-lg] text-[--color-text-primary] placeholder:text-[--color-text-subtle] focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-[--color-red] rounded-[--radius-xl] p-4 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[--color-bg-surface] rounded-[--radius-xl] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading && categories.length === 0 ? (
            <div className="py-16 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[--color-bg-elevated]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider rounded-tl-[--radius-xl]">
                    Categoría
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider rounded-tr-[--radius-xl]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`hover:bg-[--color-bg-elevated]/50 transition-colors ${
                      index !== paginated.length - 1 ? '' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-9 h-9 rounded-[--radius-md] object-cover bg-gray-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-[--radius-md] bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-[--color-text-primary]">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-[--color-text-muted]">
                      {category.description || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          category.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {category.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-[--color-text-muted]">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-1.5 rounded-[--radius-md] text-[--color-text-muted] hover:bg-[--color-bg-hover] hover:text-[--color-accent] transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          className="p-1.5 rounded-[--radius-md] text-[--color-text-muted] hover:bg-red-50 hover:text-[--color-red] transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filtered.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <p className="text-[--color-text-muted]">No se encontraron categorías</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-sm text-[--color-text-muted]">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-[--radius-md] bg-[--color-bg-elevated] disabled:opacity-40 hover:bg-[--color-bg-hover] transition-colors"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-[--radius-md] transition-colors ${
                    currentPage === page
                      ? 'bg-[--color-accent] text-white'
                      : 'bg-[--color-bg-elevated] hover:bg-[--color-bg-hover]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-[--radius-md] bg-[--color-bg-elevated] disabled:opacity-40 hover:bg-[--color-bg-hover] transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setCreateError(null); }}
        onSubmit={handleCreate}
        serverError={createError}
      />

      {editingCategory && (
        <CategoryFormModal
          isOpen={true}
          onClose={() => { setEditingCategory(null); setEditError(null); }}
          initialData={{
            name: editingCategory.name,
            description: editingCategory.description || '',
            is_active: editingCategory.is_active,
          }}
          imageUrl={editingCategory.image_url}
          onSubmit={handleEdit}
          serverError={editError}
        />
      )}

      {deletingCategory && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setDeletingCategory(null)}
          onConfirm={handleDelete}
          categoryName={deletingCategory.name}
        />
      )}
    </div>
  );
}
