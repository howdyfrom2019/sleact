import React, {useCallback, useState} from 'react';
import {Button, Form, Header, Input, Label,Error, LinkContainer} from "./styles";
import {Link, useNavigate} from "react-router-dom";
import useInput from "../../hooks/useInput";
import axios from "axios";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import {IUser} from "../../typings/db";

const LogIn = () => {
  let navigate = useNavigate();
  const { data, error, mutate } = useSWR<IUser>('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 1000000,
  });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback<(e: React.MouseEvent<HTMLButtonElement>) => void>((e) => {
    e.preventDefault();
    setLogInError(false);
    axios.post("http://localhost:3095/api/users/login", {email, password}, {withCredentials: true})
      .then((res) => {
        mutate(res.data, true);
      })
      .catch((e) => setLogInError(e.response?.data?.statusCode === 401));
  }, [email, password]);

  if (data) {
    navigate("/workspace/channel");
  }
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit" onClick={onSubmit}>로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to={"/signup"}>회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;