import React, {useCallback} from 'react';
import Modal from "../Modal";
import {Button, Input, Label} from "../../pages/Login/styles";
import useInput from "../../hooks/useInput";
import axios from "axios";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import useSWR from "swr";
import {IChannel, IUser} from "../../typings/db";
import fetcher from "../../utils/fetcher";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: React.FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams< { workspace: string; channel: string}>();
  const { data: userData, error, mutate } = useSWR<IUser>('/api/users', fetcher, {dedupingInterval: 20000});
  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const onCreateChannel = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    axios.post(`/api/workspaces/${workspace}/channels`, {
      name: newChannel,
    }, {
      withCredentials: true,
    }).then((res) => {
      setShowCreateChannelModal(false);
      mutateChannel();
      setNewChannel("");
    }).catch((e) => {
      console.dir(e);
      toast.error(e.response?.date, {position: "bottom-center"});
    });
  }, [newChannel]);
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