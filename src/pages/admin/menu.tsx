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
    const [modal, setModal] = React.useState(false);
    const [edit, setEdit] = React.useState<{
        id: number;
        data: CreateForm;
    } | undefined>()
    const { data: menu } = trpc.useQuery(['menu.get']);
    const { invalidateQueries } = trpc.useContext();

    const { mutate: remove } = trpc.useMutation(['admin.deleteMenuItem'], {
        onSuccess: () => invalidateQueries(['menu.get']),
    });

    const removeItem = React.useCallback((id: number) => {
        remove({ id });
    }, [remove]);

    const handleEdit = React.useCallback((item: Menu) => {
        setEdit({
            id: item.id,
            data: {
                ...item,
            }
        });
        setModal(true);
    }, []);

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
                        Товары
                    </Typography>
                    <Button onClick={() => setModal(true)}>
                        Создать
                    </Button>
                </Box>
                <div className={cls.root}>
                    <table>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>Себестоимость</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.item_name}</td>
                                    <td>{item.price} ₸</td>
                                    <td>{item.true_cost} ₸</td>
                                    <td>
                                        <Stack direction="row" spacing={2}>
                                            <IconButton
                                                size="sm"
                                                color="neutral"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Edit />
                                            </IconButton>
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
                setEdit(undefined);
            }}>
                <ModalDialog>
                    <ModalClose />
                    <Typography>{edit ? 'Редактирование' : 'Создание'}</Typography>
                    {edit ? <EditModal onSubmit={() => {
                        setModal(false);
                        setEdit(undefined);
                    }} id={edit.id} initial={edit.data} /> : <Create onSubmit={() => {
                        setModal(false);
                        setEdit(undefined);
                    }} />}
                </ModalDialog>
            </Modal>
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