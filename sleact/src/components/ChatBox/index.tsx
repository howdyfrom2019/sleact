import React, {useCallback, useEffect, useRef} from 'react';
import {ChatArea, Form, MentionsTextarea, SendButton, Toolbox} from "./styles";
import { ReactComponent as Plane } from "../../assets/paper-plane.svg";
import autosize from "autosize";

interface Props {
  chat: string;
  onSubmitForm: (e: React.FormEvent) => void;
  onChangeChat: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const ChatBox: React.FC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeyDownChat = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    }
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;
    autosize(textareaRef.current);
  }, []);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id={"editor-chat"}
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          placeholder={placeholder}
          ref={textareaRef}
          />
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--size_small c-wysiwyg_container__button c-wysiwyg_container__button--send c-icon_button--default' +
              (chat?.trim() ? '' : ' c-wysiwyg_container__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <Plane aria-hidden="true" x={"16px"} y={"16px"} />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
}

export default ChatBox;