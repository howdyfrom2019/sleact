import React, {useCallback} from 'react';
import {ChatArea, Form, MentionsTextarea, SendButton, Toolbox} from "./styles";
import { ReactComponent as Plane } from "../../assets/paper-plane.svg";

interface Props {
  chat: string;
}
const ChatBox: React.FC<Props> = ({ chat }) => {
  const onSubmitForm = useCallback(() => {

  }, []);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea>
          <textarea />
        </MentionsTextarea>
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