import { supabase } from './supabaseClient'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: orangered;
`;

const Wrapper = styled.section`
  padding: 40px 20px;
	border: solid 1px #ddd;
	border-top: solid 5px hsl(153 60% 53%);
	border-bottom-width: 2px;
	border-radius: 3px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;

export default function NickelsAuth() {

  return (
    <Wrapper>
      <Title className="header">CAAT</Title>
      <p className="description">Torture the data, and it will confess to anything</p>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    </Wrapper>
  )
}