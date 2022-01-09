import React, {useContext} from 'react';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';

export default function Shipping() {
  const router = useRouter();
  const {state} = useContext(Store);
  const {userInfo} = state;
  if (!userInfo) {
    router.push('/login?redirect=checkout');
  }
  return <Layout>
    Checkout
  </Layout>;
}