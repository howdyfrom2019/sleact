import { CreateMenu, CloseModalButton } from './styles';
import React, { CSSProperties, FC, PropsWithChildren, useCallback} from 'react';

interface Props {
  show: boolean;
  onCloseModal: (e: React.MouseEvent<HTMLElement>) => void;
  style?: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<PropsWithChildren<Props>> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, [])
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
