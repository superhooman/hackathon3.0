import { createTheme, Typography } from '@mui/material';
import { Header } from '../../components/Header';
import Navigation from '../../components/Navigation';
import Layout from '../../layouts/Main';
import { trpc } from '../../utils/trpc';
import cls from '../../styles/Menu.module.scss';
import { Box, Button, IconButton, Modal, ModalClose, ModalDialog, Option, Select, Stack, TextField } from '@mui/joy';
import { Delete, Edit } from '@mui/icons-material';
import React from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { locationSchema, menuItemSchema } from '../../server/router/admin';
import { Menu } from '../../server/router/menu';

const AdminPage = () => {
    const [modal, setModal] = React.useState(false);
    const { data: cashiers } = trpc.useQuery(['admin.cashiers']);
    const { invalidateQueries } = trpc.useContext();

    const { mutate: remove } = trpc.useMutation(['admin.deleteCashier'], {
        onSuccess: () => invalidateQueries(['admin.cashiers']),
    });

    const removeItem = React.useCallback((id: string) => {
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
                        Кассиры
                    </Typography>
                    <Button onClick={() => setModal(true)}>
                        Cоздать
                    </Button>
                </Box>
                <div className={cls.root}>
                    <table>
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Почта</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashiers?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
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

type CreateForm = {
    email: string;
    name: string;
    location: number;
};

const Create: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const { invalidateQueries } = trpc.useContext();
    const { data: locations } = trpc.useQuery(['locations.get']);
    const { mutateAsync: create } = trpc.useMutation(['admin.addCashier'], {
        onSuccess: () => invalidateQueries(['menu.get']),
    });

    const { getFieldProps, handleSubmit, values, setFieldValue } = useFormik<CreateForm>({
        initialValues: {
            email: '',
            name: '',
            location: -1,
        },
        onSubmit: (values, { resetForm }) => {
            create({
                ...values,
                location: Number(values.location)
            }).then(() => {
                resetForm();
                onSubmit();
            })
        }
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
                <Select placeholder="Локация" value={values.location} onChange={(v) => {
                    setFieldValue('location', v);
                }}>
                    {locations?.map((item) => (
                        <Option key={item.id} value={item.id}>{item.address}</Option>
                    ))}
                </Select>
                <TextField label="Имя" type="text" {...getFieldProps('name')} />
                <TextField label="Email" type="email" {...getFieldProps('email')} />
                <Button type="submit">Создать</Button>
            </Stack>
        </form>
    )
}

export default AdminPage;