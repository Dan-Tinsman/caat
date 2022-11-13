import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { supabase } from './supabaseClient';
import { Session } from "@supabase/gotrue-js/src/lib/types"
import Account from './Account';
import NickelsAuth from './Auth';

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <NickelsAuth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}

export default App;
