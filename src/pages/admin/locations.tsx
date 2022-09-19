import { createTheme, Typography } from '@mui/material';
import { Header } from '../../components/Header';
import Navigation from '../../components/Navigation';
import Layout from '../../layouts/Main';
import { trpc } from '../../utils/trpc';
import cls from '../../styles/Menu.module.scss';
import { Box, Button, IconButton, Modal, ModalClose, ModalDialog, Stack, TextField } from '@mui/joy';
import { Delete, Edit } from '@mui/icons-material';
import React from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { locationSchema, menuItemSchema } from '../../server/router/admin';
import { Menu } from '../../server/router/menu';

const AdminPage = () => {
    const [modal, setModal] = React.useState(false);
    const { data: locations } = trpc.useQuery(['locations.get']);
    const { invalidateQueries } = trpc.useContext();

    const { mutate: remove } = trpc.useMutation(['admin.deleteLocation'], {
        onSuccess: () => invalidateQueries(['locations.get']),
    });

    const removeItem = React.useCallback((id: number) => {
        remove({ id });
    }, [remove]);

    return (
        <Layout.Root>
            <Layout.Header>
                <Header cart={false} />
            </Layout.Header>
            <Layout.SideNav>
                <Navigation />
            </Layout.SideNav>
            <Layout.Main>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}>
                    <Typography component="h4" variant="h4">
                        Локации
                    </Typography>
                    <Button onClick={() => setModal(true)}>
                        Создать
                    </Button>
                </Box>
                <div className={cls.root}>
                    <table>
                        <thead>
                            <tr>
                                <th>Адрес</th>
                                <th>Телефон</th>
                                <th>Затраты</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.address}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.constant_cost} ₸/мес</td>
                                    <td>
                                        <Stack direction="row" spacing={2}>
                                            <IconButton
                                                size="sm"
                                                color="danger"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Delete />
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
                    <Typography>{'Создание'}</Typography>
                    <Create onSubmit={() => {
                        setModal(false);
                    }} />
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