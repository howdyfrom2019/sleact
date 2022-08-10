import React, {useCallback, useEffect, useState} from 'react';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import gravatar from 'gravatar';
import { RightMenu, Header, Chats, Channels, MenuScroll, LogOutButton, AddButton, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper, ProfileModal, ProfileImg} from "./styles";
import Channel from "../../pages/Channel";
import DirectMessage from "../../pages/DirectMessage";
import Menu from "../../components/Menu";
import {IUser} from "../../typings/db";

const Workspace = () => {
    const { params } = useParams();
    let navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLogOutSuccess, setIsLogOutSuccess] = useState(false);
    const { data: userData, error, mutate } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {withCredentials: true})
            .then((res) => {
              mutate(undefined, false);
              setIsLogOutSuccess(true);
            })
    }, []);

    const onClickUserProfile = useCallback(() => {
      setShowUserMenu((prev) => !prev);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {

    }, []);

    useEffect(() => {
      if (!userData) navigate('/login', {replace: true});
    }, [userData, isLogOutSuccess]);

    return (
        <div>
          <Header>
            <RightMenu>
              <span onClick={onClickUserProfile}>
                <ProfileImg src={gravatar.url(userData?.nickname || '', {s: '28px', d: 'retro'})} alt={userData?.nickname}/>
                {showUserMenu && <Menu style={{right: 0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                    <ProfileModal>
                        <img src={gravatar.url(userData?.nickname || '', {s: '36px', d: 'retro'})} alt={userData?.nickname} />
                        <div>
                            <span id={'profile-name'}>{userData?.nickname}</span>
                            <span id={"profile-active"}>Active</span>
                        </div>
                    </ProfileModal>
                    <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                </Menu>}
              </span>
            </RightMenu>
          </Header>
            {/*<button onClick={onLogout}>로그아웃</button>*/}
          <WorkspaceWrapper>
            <Workspaces>
              {(userData?.Workspaces || []).map((ws) => {
                return (
                  <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                    <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                  </Link>
                );
              })}
              <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
            </Workspaces>
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