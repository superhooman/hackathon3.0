import { createTheme, Typography } from '@mui/material';
import { Header } from '../../components/Header';
import Navigation from '../../components/Navigation';
import Layout from '../../layouts/Main';
import { trpc } from '../../utils/trpc';
import cls from '../../styles/Menu.module.scss';
import { Box, Button, IconButton, Modal, ModalClose, ModalDialog, Stack, Tab, TabList, Tabs, TextField } from '@mui/joy';
import { Check, Delete, Edit, ListAlt } from '@mui/icons-material';
import React from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { locationSchema, menuItemSchema } from '../../server/router/admin';
import { Menu } from '../../server/router/menu';

const AdminPage = () => {
    const [tab, setTab] = React.useState(0);
    const [modal, setModal] = React.useState(false);
    const [selected, setSelected] = React.useState(-1);
    const { data: menu } = trpc.useQuery(['menu.get']);
    const { data: orders } = trpc.useQuery(['order.getAll']);
    const { invalidateQueries } = trpc.useContext();

    const { mutate: setReady } = trpc.useMutation(['order.setReady'], {
        onSuccess: () => invalidateQueries(['order.getAll']),
    });

    const handleSetReady = React.useCallback((id: number) => {
        setReady({ id });
    }, [setReady]);

    const items = React.useMemo(() => {
        if (!orders) {
            return [];
        }
        if (tab === 0) {
            return orders.filter((order) => order.status === 'pending');
        }
        return orders.filter((order) => order.status !== 'pending');
    }, [tab, orders]);

    const selectedOrder = React.useMemo(() => {
        const order = orders?.find((item) => item.id === selected);

        if (!order) {
            return null;
        }

        const list = order.items.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return {
            ...order,
            items: list,
        }
    }, [orders, selected]);

    return (
        <Layout.Root>
            <Layout.Header>
                <Header cart={false} />
            </Layout.Header>
            <Layout.SideNav>
                <Navigation cashier />
            </Layout.SideNav>
            <Layout.Main>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}>
                    <Typography component="h4" variant="h4">
                        Заказы
                    </Typography>
                    <Tabs value={tab} onChange={(_, v) => setTab(Number(v))}>
                        <TabList>
                            <Tab value={0}>Новые</Tab>
                            <Tab value={1}>Готовые</Tab>
                        </TabList>
                    </Tabs>
                </Box>
                <div className={cls.root}>
                    <table>
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Статус</th>
                                <th>Стоимость</th>
                                <th>Покупатель</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{(new Date(item.order_date)).toLocaleDateString('ru')}&nbsp;{(new Date(item.order_date)).toLocaleTimeString('ru')}</td>
                                    <td>{{
                                        pending: 'Новый',
                                        ready: 'Готов',
                                    }[item.status]}</td>
                                    <td>{item.total_cost} ₸</td>
                                    <td>{item.user?.name || item.user?.email}</td>
                                    <td>
                                        <Stack direction="row" spacing={2}>
                                            {
                                                tab === 0 ? (
                                                    <IconButton
                                                        size="sm"
                                                        variant="outlined"
                                                        onClick={() => handleSetReady(item.id)}
                                                    >
                                                        <Check />
                                                    </IconButton>
                                                ) : null
                                            }
                                            <IconButton
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                                onClick={() => {
                                                    setSelected(item.id);
                                                    setModal(true);
                                                }}
                                            >
                                                <ListAlt />
                                            </IconButton>
                                        </Stack>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout.Main>
            <Modal open={modal} onClose={() => {
                setModal(false);
            }}>
                <ModalDialog>
                    <ModalClose />
                    <Typography>{'Заказ'} #{selectedOrder?.id}</Typography>
                    {selectedOrder?.items ? (
                        <>
                            {Object.entries(selectedOrder.items).map(([id, count]) => {
                                const item = menu?.find((item) => item.id === Number(id));
                                return (
                                    <Stack key={id} direction="row" spacing={2}>
                                        <Typography>{item?.item_name}</Typography>
                                        <Typography>{count} шт.</Typography>
                                    </Stack>
                                );
                            })}
                        </>
                    ) : null}
                </ModalDialog>
            </Modal>
        </Layout.Root>
    )
};

type CreateForm = z.infer<typeof locationSchema>;

const Create: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const { invalidateQueries } = trpc.useContext();
    const { mutateAsync: create } = trpc.useMutation(['admin.createLocation'], {
        onSuccess: () => invalidateQueries(['menu.get']),
    });

    const { getFieldProps, handleSubmit } = useFormik<CreateForm>({
        initialValues: {
            address: '',
            phone: '',
            constant_cost: 0,
            lon: 0,
            lat: 0,
        },
        onSubmit: (values, { resetForm }) => {
            create({
                ...values,
                constant_cost: Number(values.constant_cost),
                lon: Number(values.lon),
                lat: Number(values.lat),
            }).then(() => {
                resetForm();
                onSubmit();
            })
        }
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
                <TextField label="Адрес" {...getFieldProps('address')} />
                <TextField label="Телефон" type="tel" {...getFieldProps('phone')} />
                <TextField label="Затраты" type="number" {...getFieldProps('constant_cost')} />
                <TextField label="Долгота" type="number" {...getFieldProps('lat')} />
                <TextField label="Широта" type="number" {...getFieldProps('lon')} />
                <Button type="submit">Создать</Button>
            </Stack>
        </form>
    )
}

export default AdminPage;