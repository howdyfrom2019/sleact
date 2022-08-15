import React, {useCallback, useEffect, useState} from 'react';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import gravatar from 'gravatar';
import {
  RightMenu,
  Header,
  Chats,
  Channels,
  MenuScroll,
  LogOutButton,
  AddButton,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
  ProfileModal,
  ProfileImg
} from "./styles";
import {Button, Input, Label} from "../../pages/Login/styles";
import Channel from "../../pages/Channel";
import DirectMessage from "../../pages/DirectMessage";
import Menu from "../../components/Menu";
import {IUser} from "../../typings/db";
import useInput from "../../hooks/useInput";
import Modal from "../../components/Modal";
import CreateChannelModal from "../../components/CreateChannelModal";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Workspace = () => {
  const {params} = useParams();
  let navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLogOutSuccess, setIsLogOutSuccess] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const {data: userData, error, mutate} = useSWR<IUser>('http://localhost:3095/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {withCredentials: true})
      .then((res) => {
        mutate(undefined, false);
        setIsLogOutSuccess(true);
      })
  }, []);

  const onCloseUserProfile = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(() => {
    if (!newWorkspace || !newWorkspace.trim()) return;
    if (!newUrl || !newUrl.trim()) return;
    axios.post('http://localhost:3095/api/workspaces', {
      workspace: newWorkspace,
      url: newUrl,
    }, {
      withCredentials: true,
    })
      .then((res) => {
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      }).catch((e) => {
      console.dir(e);
      toast.error(e.response?.data, {position: 'bottom-center'});
    })
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal((prev) => !prev);
  }, [])

  useEffect(() => {
    if (!userData) navigate('/login', {replace: true});
  }, [userData, isLogOutSuccess]);

  return (
    <div>
      <Header>
        <RightMenu>
              <span onClick={onClickUserProfile}>
                <ProfileImg src={gravatar.url(userData?.nickname || '', {s: '28px', d: 'retro'})}
                            alt={userData?.nickname}/>
                {showUserMenu &&
                    <Menu style={{right: 0, top: 38}} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                        <ProfileModal>
                            <img src={gravatar.url(userData?.nickname || '', {s: '36px', d: 'retro'})}
                                 alt={userData?.nickname}/>
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
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickAddChannel}>채널만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
          </MenuScroll>
        </Channels>
        <Chats>
          {params === "channel" && <Channel/>}
          {params === "dm" && <DirectMessage/>}
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id={"workspace-label"}>
            <span>워크스페이스 이름</span>
            <Input id={"workspace"} value={newWorkspace} onChange={onChangeNewWorkspace}/>
          </Label>
          <Label id={"workspace-url-label"}>
            <span>워크스페이스 url</span>
            <Input id={"workspace"} value={newUrl} onChange={onChangeNewUrl}/>
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal} />
    </div>
  );
}

export default Workspace;