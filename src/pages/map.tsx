import { Header } from '../components/Header';
import { TabNavigation } from '../components/TabNavigation';
import { MapFeature } from '../features/Map';
import Layout from '../layouts/Main';

const Map = ( ) => {
  return (
    <Layout.Root single>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <MapFeature />
      </Layout.Main>
      <Layout.Nav>
        <TabNavigation />
      </Layout.Nav>
    </Layout.Root>
  )
}

export default Map;