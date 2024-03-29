import useInput from '../../hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '../Login/styles';
import fetcher from '../../utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

const SignUp = () => {
  let navigate = useNavigate();
  const { data: userData } = useSWR('/api/users', fetcher);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');

  const onChangePassword = useCallback<(e: React.ChangeEvent<HTMLInputElement>) => void>(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(passwordCheck !== e.target.value);
    },
    [passwordCheck, setPassword],
  );

  const onChangePasswordCheck = useCallback<(e: React.ChangeEvent<HTMLInputElement>) => void>(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(password !== e.target.value);
    },
    [password, setPasswordCheck],
  );

  const onSubmit = useCallback<(e: React.ChangeEvent<HTMLFormElement>) => void>(
    (e) => {
      e.preventDefault();
      setSignUpError('');
      setSignUpSuccess(false);
      if (!mismatchError && nickname) {
        console.log('서버로 회원가입하기');
        axios.post("http://localhost:3095/api/users", {email, nickname, password})
          .then((res) => {
            setSignUpSuccess(true);
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
            setSignUpError(e.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, mismatchError],
  );

  if (userData) {
    navigate("/workspace/sleact/channel/일반", {replace: true});
    return <></>;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to={"/login"}>로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
