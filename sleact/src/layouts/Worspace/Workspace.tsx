import React, {useCallback, useState} from 'react';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import gravatar from 'gravatar';
import { RightMenu, Header, Chats, Channels, MenuScroll, LogOutButton, AddButton, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper, ProfileModal, ProfileImg} from "./styles";
import Channel from "../../pages/Channel";
import DirectMessage from "../../pages/DirectMessage";

const Workspace = () => {
    const { params } = useParams();
    let navigate = useNavigate();
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {withCredentials: true})
            .then((res) => {
                mutate(res.data, false);
            });
    }, []);

    if (!data) {
        navigate('/login', {replace: true});
    }
    return (
        <div>
          <Header>
            <RightMenu>
              <span>
                <ProfileImg src={gravatar.url(data?.nickname, {s: '28px', d: 'retro'})} alt={data?.nickname}/>
              </span>
            </RightMenu>
          </Header>
            <button onClick={onLogout}>로그아웃</button>
          <WorkspaceWrapper>
            <Workspaces>test</Workspaces>
            <Channels>
              <WorkspaceName>Sleact</WorkspaceName>
              <MenuScroll>
                {/*<Menu>Menu</Menu>*/}
              </MenuScroll>
            </Channels>
            <Chats>
              {params === "channel" && <Channel />}
              {params === "dm" && <DirectMessage />}
            </Chats>
          </WorkspaceWrapper>
            {/*{children}*/}
        </div>
    );
}

export default Workspace;