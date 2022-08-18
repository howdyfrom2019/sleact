import React, {useEffect, VFC} from 'react';
import {NavLink, useLocation, useParams} from "react-router-dom";
import fetcher from "../../utils/fetcher";
import useSWR from "swr";
import {IUser} from "../../typings/db";

interface Props {
  member: IUser;
  isOnline: boolean;
}
const EachDM: React.FC<Props> = ({ member, isOnline }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, member]);

  return (
    <NavLink key={member.id} className={({ isActive}) => isActive ? "selected" : ""} to={`/workspace/${workspace}/dm/${member.id}`}>
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled p-channel_sidebar__presence_icon--on-avatar c-presence ${
          isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="false"
        title={isOnline ? "온라인" : "오프라인"}
        aria-label={isOnline ? "온라인" : "오프라인"}
        data-qa="presence_indicator"
        data-qa-type={"presence-online"}
        data-qa-presence-self="true"
        data-qa-presence-active="true"
        data-qa-presence-dnd="false"
        style={{ background: isOnline ? "#33cc33" : "transparent", width: 8, height: 8, borderRadius: "50%", border: "1px solid #FAFAFA" }}
      />
      <span className={count && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </NavLink>
  );
};

export default EachDM;