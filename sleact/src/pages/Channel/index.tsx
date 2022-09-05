import React, {useCallback, useState} from 'react';
import { Container, Header, DragOver } from "./styles";
import ChatList from "../../components/ChatList";
import ChatBox from "../../components/ChatBox";

const Channel = () => {
  const [chat, setChat] = useState('');
  const onSubmitForm = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log(chat);
    setChat('');
  }, [chat, setChat]);

  const onChangeChatFunc = useCallback((e: { target: { value: string; }; }) => {
    setChat(e.target.value);
  }, [setChat]);

  return (
    <Container>
      <Header># 채널</Header>
      <ChatList />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChatFunc} />
    </Container>
  );
}

export default Channel;