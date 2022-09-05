import React, {useCallback, useState} from 'react';
import {Container, Header} from "./styles";
import gravatar from "gravatar";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import {useParams} from "react-router";
import ChatBox from "../../components/ChatBox";
import ChatList from "../../components/ChatList";
// import useInput from "../../hooks/useInput";
import axios from "axios";
import {IDM} from "../../typings/db";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace?: string, id?: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('api/users', fetcher);
  const [chat, setChat] = useState('');
  const { data: chatData, mutate: mutateChat} = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher
  );

  const onSubmitForm = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (chat?.trim()) {
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat,
      })
        .then((res) => {
          mutateChat();
          setChat('');
        }).catch((e) => {
          console.dir(e);
      })
    }
  }, [chat, id, mutateChat, workspace]);

  const onChangeChatFunc = useCallback((e: { target: { value: string; }; }) => {
    setChat(e.target.value);
  }, [setChat]);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: "retro" })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatData={chatData || []} />
      <ChatBox chat={chat} onChangeChat={onChangeChatFunc} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default DirectMessage;