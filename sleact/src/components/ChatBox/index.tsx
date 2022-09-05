import React, {useCallback, useEffect, useRef} from 'react';
import {ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox} from "./styles";
import { ReactComponent as Plane } from "../../assets/paper-plane.svg";
import autosize from "autosize";
import {Mention, SuggestionDataItem} from "react-mentions";
import useSWR from "swr";
import {IUser} from "../../typings/db";
import fetcher from "../../utils/fetcher";
import {useParams} from "react-router-dom";
import gravatar from "gravatar";

interface Props {
  chat: string;
  onSubmitForm: (e: React.FormEvent) => void;
  onChangeChat: (e: { target: { value: string; }; }) => void;
  placeholder?: string;
}

const ChatBox: React.FC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: memberData } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onKeyDownChat = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        console.log(chat);
        onSubmitForm(e);
      }
    }
  }, [chat]);

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
     search: string,
     highlightedDisplay: React.ReactNode,
     index: number,
     focused: boolean
    ):  React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focused}>
          <img src={gravatar.url(memberData[index].email, { s: "20px", d: "retro"})} alt={memberData[index].nickname} />
          <span>{highlightedDisplay}</span>
        </EachMention>
      )
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
          allowSuggestionsAboveCursor
          inputRef={textareaRef}
          >
          <Mention
            trigger={"@"}
            data={memberData?.map(v => ({id: v.id, display: v.nickname})) || []}
            appendSpaceOnAdd={true}
            renderSuggestion={renderSuggestion}
          />
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