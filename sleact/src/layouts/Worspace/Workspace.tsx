import React, {useCallback, useEffect, useState} from 'react';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import gravatar from 'gravatar';
import { RightMenu, Header, Chats, Channels, MenuScroll, LogOutButton, AddButton, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper, ProfileModal, ProfileImg} from "./styles";
import Channel from "../../pages/Channel";
import DirectMessage from "../../pages/DirectMessage";
import Menu from "../../components/Menu";

const Workspace = () => {
    const { params } = useParams();
    let navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {withCredentials: true})
            .then((res) => {
                mutate(res.data, false);
            });
    }, []);

    const onClickUserProfile = useCallback(() => {
      setShowUserMenu((prev) => !prev);
    }, []);

    useEffect(() => {
      if (!data || data === "ok") navigate('/login', {replace: true});
    }, [data]);

    return (
        <div>
          <Header>
            <RightMenu>
              <span onClick={onClickUserProfile}>
                <ProfileImg src={gravatar.url(data?.nickname, {s: '28px', d: 'retro'})} alt={data?.nickname}/>
                {showUserMenu && <Menu style={{right: 0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                    <ProfileModal>
                        <img src={gravatar.url(data.nickname, {s: '36px', d: 'retro'})} alt={data.nickname} />
                        <div>
                            <span id={'profile-name'}>{data.nickname}</span>
                            <span id={"profile-active"}>Active</span>
                        </div>
                    </ProfileModal>
                    <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                </Menu>}
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