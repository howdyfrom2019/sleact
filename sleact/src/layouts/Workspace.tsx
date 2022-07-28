import React, {useCallback, useState} from 'react';
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Workspace: React.FC<React.PropsWithChildren> = ({children}) => {
    let navigate = useNavigate();
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {withCredentials: true})
            .then((res) => {
                mutate(false);
            });
    }, []);

    if (!data) {
        navigate('/login', {replace: true});
    }
    return (
        <div>
            <button onClick={onLogout}>로그아웃</button>
            {children}
        </div>
    );
}

export default Workspace;