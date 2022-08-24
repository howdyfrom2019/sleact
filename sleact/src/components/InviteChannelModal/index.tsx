import React, {useCallback} from 'react';
import Modal from "../Modal";
import { Label, Button, Input} from "../../pages/Login/styles";
import {useParams} from "react-router-dom";
import useInput from "../../hooks/useInput";
import useSWR from "swr";
import {IUser} from "../../typings/db";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {toast} from "react-toastify";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: React.FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate: mutateMembers } = useSWR<IUser[]>(
    channel && userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;
    axios
      .post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
        email: newMember,
      }, {
        withCredentials: true
      })
      .then((res) => {
        mutateMembers(res.data, false);
        setShowInviteChannelModal(false);
        setNewMember('');
    }).catch((e) => {
      console.dir(e);
      toast(e.response?.data, {position: "bottom-center"});
    })
  }, [newMember]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id={"member-label"}>
          <span>채널 멤버 초대</span>
          <Input id={"member"} type={"email"} value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type={"submit"}>초대하기</Button>
      </form>
    </Modal>
  )
}

export default InviteChannelModal;