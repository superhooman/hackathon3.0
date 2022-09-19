import { Avatar, Box, Card, CardContent, CardOverflow, CircularProgress, Stack, Tab, TabList, Tabs, Typography } from "@mui/joy";
import { useSession } from "next-auth/react"
import React from "react";
import { Order } from "../../server/router/order";
import { trpc } from "../../utils/trpc";

const getFirstLetter = (str: string) => (str[0] || '').toUpperCase();

const fakeTime = (i: number) => (5 - i * 0.5 + (i > 5 ? 2 : 0));

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    return (
        <Card
            row
            variant="outlined"
            sx={{
                minWidth: '260px',
                gap: 2,
                bgcolor: 'background.body',
            }}
        >
            <CardContent>
                <Typography fontWeight="md" textColor="success.plainColor" mb={0.5}>
                    Заказ №{order.id}
                </Typography>
                <Typography level="body2">
                    {(new Date(order.order_date).toLocaleDateString('ru'))}
                    <span> - </span>
                    {(new Date(order.order_date).toLocaleTimeString('ru'))}
                </Typography>
                <Typography level="body2">
                    Примерное время: {fakeTime(order.id - 5)} минут
                </Typography>
            </CardContent>
            <CardOverflow
                variant="soft"
                color="primary"
                sx={{
                    px: 0.2,
                    writingMode: 'vertical-rl',
                    textAlign: 'center',
                    fontSize: 'xs2',
                    fontWeight: 'xl2',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                }}
            >
                {order.status}
            </CardOverflow>
        </Card>
    )
}

export const User = () => {
    const { data } = useSession();
    const { data: orders } = trpc.useQuery(['order.getMy']);

    const [tab, setTab] = React.useState(0);

    if (!data || !data.user) {
        return (
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Stack spacing={2}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}>
                <Avatar
                    alt={data.user.name || 'User'}
                    src={data.user.image || ''}
                >
                    {getFirstLetter(data.user.name || '')}
                </Avatar>
                <Typography>{data.user.name}</Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(Number(v))}>
                <TabList>
                    <Tab value={0}>Готовятся</Tab>
                    <Tab value={1}>История</Tab>
                </TabList>
            </Tabs>
            {
                orders?.filter(({ status }) => status === (tab === 0 ? 'pending' : 'ready')).sort((a, b) => a.id - b.id).map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))
            }
        </Stack>
    )
}