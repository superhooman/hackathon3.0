
import { GetServerSideProps } from 'next';
import { Header } from '../components/Header';
import { TabNavigation } from '../components/TabNavigation';
import { User } from '../features/User';
import Layout from '../layouts/Main';

const CartPage = ( ) => {
  return (
    <Layout.Root single>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <User />
      </Layout.Main>
      <Layout.Nav>
        <TabNavigation />
      </Layout.Nav>
    </Layout.Root>
  )
}

export default CartPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.headers.host?.includes('ngrok')) {
    ctx.res.writeHead(302, {
      Location: 'http://localhost:3000/profile'
    });
    return {
      props: {

      }
    }
  }
  return {
    props: {},
  }
}