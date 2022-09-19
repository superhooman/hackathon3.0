import { Header } from '../../components/Header';
import Navigation from '../../components/Navigation';
import Layout from '../../layouts/Main';
import { trpc } from '../../utils/trpc';
import React from 'react';
import { Card, Stack, Typography as Text } from '@mui/joy';
import { Divider, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TICK_COLOR = '#14b8a6';
const LINE_COLOR = '#dddee0';

const AdminPage = () => {
    const { data: stats } = trpc.useQuery(['stats.get']);

    return (
        <Layout.Root>
            <Layout.Header>
                <Header cart={false} />
            </Layout.Header>
            <Layout.SideNav>
                <Navigation />
            </Layout.SideNav>
            <Layout.Main>
                {stats?.mrginality.map((item) => (
                    <Card variant="outlined" key={item.id}>
                        <Typography gutterBottom variant="h5" component="h5">{item.address}</Typography>
                        <Stack spacing={0.5}>
                            <Stack direction="row" sx={{ gap: 1, justifyContent: 'space-between' }}>
                                <Text fontSize="sm">Оборот</Text>
                                <Stack direction="row">
                                    <Text fontSize="sm" color="success">+{item.total_cost}₸</Text>
                                </Stack>
                            </Stack>
                            <Stack direction="row" sx={{ gap: 1, justifyContent: 'space-between' }}>
                                <Text fontSize="sm">Расходы</Text>
                                <Stack direction="row">
                                    <Text fontSize="sm" color="danger">-{item.total_true_cost}₸</Text>
                                </Stack>
                            </Stack>
                            <Stack direction="row" sx={{ gap: 1, justifyContent: 'space-between' }}>
                                <Text fontSize="sm">Аренда и обслуживание</Text>
                                <Stack direction="row">
                                    <Text fontSize="sm" color="danger">-{item.constant_cost}₸</Text>
                                </Stack>
                            </Stack>
                            <Divider />
                            <Stack direction="row" sx={{ gap: 1, justifyContent: 'space-between' }}>
                                <Text fontSize="sm">Итого</Text>
                                <Stack direction="row">
                                    <Text fontSize="sm" color={item.earnings > 0 ? 'success' : "danger"}>{item.earnings}₸</Text>
                                </Stack>
                            </Stack>
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart
                                    width={500}
                                    height={320}
                                    data={[{ average: 0 }, { average: item.total_cost }]}
                                    margin={{
                                        top: 20,
                                        right: 0,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={LINE_COLOR}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 12, color: TICK_COLOR }}
                                        tickLine={{ stroke: LINE_COLOR }}
                                        axisLine={{ stroke: LINE_COLOR }}
                                    />
                                    <YAxis
                                        unit="₸"
                                        tickSize={3}
                                        tick={{ fontSize: 12, color: TICK_COLOR }}
                                        tickLine={{ stroke: LINE_COLOR }}
                                        axisLine={{ stroke: LINE_COLOR }}
                                    />
                                    <Line type="monotone" dataKey="average" stroke="var(--joy-palette-primary-500)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Stack>
                    </Card>
                ))}
            </Layout.Main>
        </Layout.Root>
    )
};

export default AdminPage;