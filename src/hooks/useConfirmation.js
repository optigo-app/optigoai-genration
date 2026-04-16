import { useState, useCallback } from 'react';
import ConfirmationDialog from '@/components/Reusable/ConfirmationDialog';
import CONFIRMATION_CONFIG from '@/config/confirmationConfig';

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  const confirm = useCallback((configKey, onConfirm) => {
    const configData = CONFIRMATION_CONFIG[configKey];
    if (!configData) {
      console.warn(`Confirmation config not found for key: ${configKey}`);
      return;
    }
    setConfig(configData);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setConfig(null);
    setOnConfirmCallback(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    handleClose();
  }, [onConfirmCallback, handleClose]);

  const ConfirmationComponent = useCallback(
    () => (
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        {...config}
      />
    ),
    [isOpen, handleClose, handleConfirm, config]
  );

  return { confirm, ConfirmationComponent };
}

export default useConfirmation;
