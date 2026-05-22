import { Modal, Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, categoryName }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar categoría" size="sm">
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-[--color-red]" />
        </div>
        <div>
          <p className="text-[--color-text-primary] font-medium">
            ¿Eliminar <span className="font-bold">"{categoryName}"</span>?
          </p>
          <p className="text-sm text-[--color-text-muted] mt-1">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
}