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
import { menuItemSchema } from '../../server/router/admin';
import { Menu } from '../../server/router/menu';
// import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

// const columns: GridColDef[] = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     {
//         field: 'item_name',
//         headerName: 'Название',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'price',
//         headerName: 'Цена',
//         type: 'number',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'true_price',
//         headerName: 'Себестоимость',
//         type: 'number',
//         width: 110,
//         editable: true,
//     },
//     {
//         field: 'description',
//         headerName: 'Описание',
//         sortable: false,
//         width: 160,
//     },
// ];

const AdminPage = () => {
    const { data: users } = trpc.useQuery(['discount.getUsers']);
    const [user, setUser] = React.useState('');
    const { invalidateQueries } = trpc.useContext();

    const [change, setChange] = React.useState(0);

    const { data: discount } = trpc.useQuery(['discount.getDiscounts', user], {
        enabled: !!user,
    });

    const { mutate: add } = trpc.useMutation(['discount.addDiscount'], {
        onSuccess: () => invalidateQueries(['discount.getDiscounts']),
    });

    const changeDiscount = React.useCallback(() => {
        add({ amount: change, user_id: user });
    }, [add, user, change]);

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
                        Скидки
                    </Typography>
                    <Select value={user} onChange={(v) => setUser(v || '')} placeholder="Пользователь">
                        {users?.map(user => (
                            <Option key={user.id} value={user.id}>
                                {user.name || user.email}
                            </Option>
                        ))}
                    </Select>
                </Box>
                <Stack spacing={1}>
                    <Typography component="h5" variant="h5">
                        Текущая скидка
                    </Typography>
                    <Typography component="h5">
                        {discount ? `${discount.amount ?? 0}%` : 'Нет'}
                    </Typography>
                    <TextField value={change} onChange={({ target: { value } }) => setChange(Number(value))} type="number" />
                    <Button onClick={changeDiscount}>Изменить</Button>
                </Stack>
            </Layout.Main>
        </Layout.Root>
    )
};

type CreateForm = z.infer<typeof menuItemSchema>;

const Create: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const { invalidateQueries } = trpc.useContext();
    const { mutateAsync: create } = trpc.useMutation(['admin.createMenuItem'], {
        onSuccess: () => invalidateQueries(['menu.get']),
    });

    const { getFieldProps, handleSubmit } = useFormik<CreateForm>({
        initialValues: {
            item_name: '',
            price: 0,
            true_cost: 0,
            description: '',
            image: '',
            food_type: '',
        },
        onSubmit: (values, { resetForm }) => {
            create({
                ...values,
                price: Number(values.price),
                true_cost: Number(values.true_cost),
            }).then(() => {
                resetForm();
                onSubmit();
            })
        }
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
                <TextField label="Название" {...getFieldProps('item_name')} />
                <TextField label="Цена" {...getFieldProps('price')} />
                <TextField label="Себестоимость" {...getFieldProps('true_cost')} />
                <TextField label="Описание" {...getFieldProps('description')} />
                <TextField label="Картинка" {...getFieldProps('image')} />
                <TextField label="Категория" {...getFieldProps('food_type')} />
                <Button type="submit">Создать</Button>
            </Stack>
        </form>
    )
}

const EditModal: React.FC<{ onSubmit: () => void, id: number, initial: CreateForm }> = ({ onSubmit, id, initial }) => {
    const { invalidateQueries } = trpc.useContext();
    const { mutateAsync: update } = trpc.useMutation(['admin.updateMenuItem'], {
        onSuccess: () => invalidateQueries(['menu.get']),
    });

    const { getFieldProps, handleSubmit } = useFormik<CreateForm>({
        initialValues: initial,
        onSubmit: (values, { resetForm }) => {
            update({
                id,
                data: {
                    ...values,
                    price: Number(values.price),
                    true_cost: Number(values.true_cost),
                }
            }).then(() => {
                resetForm();
                onSubmit();
            })
        }
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
                <TextField label="Название" {...getFieldProps('item_name')} />
                <TextField label="Цена" type="number" {...getFieldProps('price')} />
                <TextField label="Себестоимость" type="number" {...getFieldProps('true_cost')} />
                <TextField label="Описание" {...getFieldProps('description')} />
                <TextField label="Картинка" {...getFieldProps('image')} />
                <TextField label="Категория" {...getFieldProps('food_type')} />
                <Button type="submit">Обновить</Button>
            </Stack>
        </form>
    )
}

export default AdminPage;