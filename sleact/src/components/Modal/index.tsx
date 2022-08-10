import React, {useCallback} from 'react';
import {CloseModalButton, CreateModal} from "./styles";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  children: React.ReactElement;
}

const Modal:React.FC<Props> = ({show, children, onCloseModal}) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;