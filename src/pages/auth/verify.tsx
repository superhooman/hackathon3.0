import { Alert, Button, Stack } from "@mui/joy";
import { NextPage } from "next";
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import { Header } from "../../components/Header";
import Layout from '../../layouts/Main';
import Link from "next/link";

const Verify: NextPage = () => {
    return (
        <Layout.Root single>
            <Layout.Header>
                <Header />
            </Layout.Header>
            <Layout.Main sx={{
                alignItems: 'stretch',
                justifyContent: 'center',
                flexDirection: 'column',
                display: 'flex',
            }}>
                <Stack direction="column" spacing={2}>
                    <Alert
                        sx={{ alignItems: 'flex-start' }}
                        startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
                    >
                        Письмо для авторизации отправлено вам на почту. Проверьте почту и перейдите по ссылке в письме.
                    </Alert>
                    <Link href="/auth/login" passHref>
                        <Button>Вернуться назад</Button>
                    </Link>
                </Stack>
            </Layout.Main>
        </Layout.Root>
    )
}

export default Verify;
