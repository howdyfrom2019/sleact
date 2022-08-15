import React, {useCallback} from 'react';
import Modal from "../Modal";
import {Button, Input, Label} from "../../pages/Login/styles";
import useInput from "../../hooks/useInput";

interface Props {
  show: boolean;
  onCloseModal: () => void;
}
const CreateChannelModal: React.FC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onChangeNewChannel] = useInput('');
  const onCreateChannel = useCallback(() => {

  }, []);
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id={"channel-label"}>
          <span>채널</span>
          <Input id={"channel"} value={newChannel} onChange={onChangeNewChannel}/>
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
}

export default CreateChannelModal;