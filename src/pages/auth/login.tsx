import { Box, Button, Stack, TextField, Typography } from "@mui/joy";
import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from "next-auth/react";
import Layout from '../../layouts/Main';
import React from "react";

import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { Header } from "../../components/Header";

interface Props {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

const ICONS: Record<string, React.ReactNode> = {
    'google': <GoogleIcon />,
    'email': <EmailIcon />,
}

const LABELS: Record<string, string> = {
    'google': 'Google',
    'email': 'почту',
}

const Login: NextPage<Props> = ({ providers }) => {
    const [screen, setScreen] = React.useState<'main' | 'email'>('main');

    const [email, setEmail] = React.useState('');

    const handleSignIn = React.useCallback((providerId: string) => {
        if (providerId === 'email') {
            setScreen('email');
            return;
        }
        signIn(providerId, {
            callbackUrl: '/',
        });
    }, []);

    const goBack = React.useCallback(() => {
        setScreen('main');
    }, []);

    const handleEmailChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
        setEmail(e.target.value);
    }, []);

    const handleEmailSignIn = React.useCallback(() => {
        signIn('email', {
            email,
            callbackUrl: '/',
        });
    }, [email]);

    if (screen === 'email') {
        return (
            <Stack direction="column" spacing={1}>
                <TextField value={email} onChange={handleEmailChange} type="email" placeholder="email@example.com" label="Email" />
                <Button onClick={handleEmailSignIn}>Войти</Button>
                <Button onClick={goBack} variant="soft">Назад</Button>
            </Stack>
        )
    }

    return (
        <Stack direction="column" spacing={2}>
            <Box>
                <Typography gutterBottom component="h2" fontWeight="xl">
                    Войдите в аккаунт
                </Typography>
                <Typography component="p" textColor="neutral.500" fontSize="sm">
                    Используйте один из следующих способов. Если у вас нет аккаунта, то он создастся автоматически.
                </Typography>
            </Box>
            <Stack direction="column" spacing={1}>
                {Object.values(providers ?? {}).map((provider) => (
                    <div key={provider.name}>
                        <Button
                            startIcon={ICONS[provider.id]}
                            onClick={() => handleSignIn(provider.id)}
                            fullWidth
                        >
                            Войти через {LABELS[provider.id]}
                        </Button>
                    </div>
                ))}
            </Stack>
        </Stack>
    )
}

const Root: NextPage<Props> = (props) => (
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
            <Login {...props} />
        </Layout.Main>
    </Layout.Root>
)

export default Root;

export const getServerSideProps: GetServerSideProps<Props> = async _ctx => {
    const providers = await getProviders();
    return {
        props: {
            providers,
        },
    };
}