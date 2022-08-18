import React, {useCallback} from 'react';
import Modal from "../Modal";
import { Label, Button, Input} from "../../pages/Login/styles";
import {useParams} from "react-router-dom";
import useInput from "../../hooks/useInput";
import useSWR from "swr";
import {IChannel, IUser} from "../../typings/db";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {toast} from "react-toastify";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}
const InviteWorkspaceModal: React.FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { workspace } = useParams<{ workspace: string, channel: string}>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate: mutateMembers } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;
    axios
      .post(`/api/workspaces/${workspace}/members`, {
        email: newMember,
      }, {
        withCredentials: true
      }).then((res) => {
        mutateMembers(res.data, false);
        setShowInviteWorkspaceModal(false);
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
          <span>이메일</span>
          <Input id={"member"} type={"email"} value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type={"submit"}>초대하기</Button>
      </form>
    </Modal>
  )
}

export default InviteWorkspaceModal;