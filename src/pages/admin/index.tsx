import { Typography } from '@mui/material';
import { Header } from '../../components/Header';
import Navigation from '../../components/Navigation';
import Layout from '../../layouts/Main';

const AdminPage = () => {
    return (
        <Layout.Root>
            <Layout.Header>
                <Header cart={false} />
            </Layout.Header>
            <Layout.SideNav>
                <Navigation />
            </Layout.SideNav>
            <Layout.Main>
                <Typography>
                    h1llo
                </Typography>
            </Layout.Main>
        </Layout.Root>
    )
};

export default AdminPage;