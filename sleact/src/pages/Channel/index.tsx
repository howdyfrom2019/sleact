import React, {useCallback} from 'react';
import { Container, Header, DragOver } from "./styles";
import ChatList from "../../components/ChatList";
import ChatBox from "../../components/ChatBox";
import useInput from "../../hooks/useInput";

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log(chat);
    setChat('');
  }, [chat]);

  return (
    <Container>
      <Header># 채널</Header>
      <ChatList />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
}

export default Channel;