import { Header } from '../components/Header';
import { TabNavigation } from '../components/TabNavigation';
import { Cart } from '../features/Cart';
import Layout from '../layouts/Main';

const CartPage = ( ) => {
  return (
    <Layout.Root single>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <Cart />
      </Layout.Main>
      <Layout.Nav>
        <TabNavigation />
      </Layout.Nav>
    </Layout.Root>
  )
}

export default CartPage;