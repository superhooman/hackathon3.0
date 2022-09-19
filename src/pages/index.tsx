import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Header } from '../components/Header';
import { TabNavigation } from '../components/TabNavigation';
import { Menu } from '../features/Menu';
import Layout from '../layouts/Main';
import { prisma } from '../server/db/client';

const Index = ( ) => {
  return (
    <Layout.Root single>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <Menu />
      </Layout.Main>
      <Layout.Nav>
        <TabNavigation />
      </Layout.Nav>
    </Layout.Root>
  )
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      }
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });

  if (!user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      }
    }
  }

  if (user.type === 'ADMIN') {
    return {
      redirect: {
        destination: '/admin/menu',
        permanent: false,
      }
    }
  }

  if (user.type === 'CASHIER') {
    return {
      redirect: {
        destination: '/cashier',
        permanent: false,
      }
    }
  }

  return {
    props: {},
  }
}
