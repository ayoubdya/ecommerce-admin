import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Are you sure?"
      description="This action cannot be undone."
    >
      <div className="pt-6 space-x-2 flex items-center justify-end">
        <Button variant="outline" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" disabled={loading} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
