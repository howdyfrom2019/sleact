import React, {FC, useCallback, useState} from 'react';
import fetcher from "../../utils/fetcher";
import {IChannel, IUser} from "../../typings/db";
import useSWR from "swr";
import {useParams} from "react-router-dom";
import {CollapseButton} from "../DMList/styles";

interface Props {
  channelData?: IChannel[];
  userData?: IUser;
}

const ChannelList: React.FC<Props> = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const [channelCollapse, setChannelCollapse] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return <div>{channel.name}</div>;
            {/*return <EachChannel key={channel.id} channel={channel} />;*/}
          })}
      </div>
    </>
  );
};

export default ChannelList;