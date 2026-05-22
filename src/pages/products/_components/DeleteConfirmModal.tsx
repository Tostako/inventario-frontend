import { Modal, Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 productName: string;
 isDeleting?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName, isDeleting }: DeleteConfirmModalProps) {
 return (
 <Modal isOpen={isOpen} onClose={onClose} title="Eliminar producto" size="sm">
 <div className="text-center space-y-4">
 <div className="mx-auto w-12 h-12 rounded-full bg-[--color-error-muted] flex items-center justify-center">
 <AlertTriangle className="h-6 w-6 text-[--color-red]" />
 </div>
 <div>
 <p className="text-[--color-text-primary] font-medium">
 ¿Estás seguro de eliminar <span className="font-bold">"{productName}"</span>?
 </p>
 <p className="text-sm text-[--color-text-muted] mt-1">
 Esta acción no se puede deshacer. El producto será eliminado permanentemente de tu inventario.
 </p>
 </div>
 <div className="flex justify-center gap-3 pt-2">
 <Button variant="secondary" onClick={onClose}>
 Cancelar
 </Button>
 <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
 Eliminar
 </Button>
 </div>
 </div>
 </Modal>
 );
}