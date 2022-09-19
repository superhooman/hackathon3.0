import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import CoffeeIcon from '@mui/icons-material/Coffee';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Icons import
import RoomIcon from '@mui/icons-material/Room';
import DiscountIcon from '@mui/icons-material/Discount';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

const MenuItems = [
    {
        title: 'Меню',
        icon: <CoffeeIcon fontSize="small" />,
        path: '/admin/menu',
    },
    {
        title: 'Локации',
        icon: <RoomIcon fontSize="small" />,
        path: '/admin/locations',
    },
    {
        title: 'Кассиры',
        icon: <SupervisedUserCircleIcon fontSize="small" />,
        path: '/admin/users',
    },
    {
        title: 'Статистика',
        icon: <QueryStatsIcon fontSize="small" />,
        path: '/admin/stats',
    }
]

const CashierMenu = [
    {
        title: 'Заказы',
        icon: <CoffeeIcon fontSize="small" />,
        path: '/cashier',
    },
    {
        title: 'Скидки',
        icon: <DiscountIcon fontSize="small" />,
        path: '/cashier/discounts',
    },
]

export default function Navigation({ cashier }: { cashier?: boolean }) {
    const { pathname } = useRouter();

    return (
        <List size="sm" sx={{ '--List-item-radius': '8px' }}>
            <ListItem nested sx={{ p: 0 }}>
                <Box
                    sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography
                        id="nav-list-browse"
                        textColor="neutral.500"
                        fontWeight={700}
                        sx={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '.1rem',
                        }}
                    >
                        Меню
                    </Typography>
                </Box>
                <List
                    aria-labelledby="nav-list-browse"
                    sx={{
                        '& .JoyListItemButton-root': { p: '8px' },
                    }}
                >
                    {(cashier ? CashierMenu : MenuItems).map(({ path, title, icon }) => {
                        const selected = path === pathname;
                        return (
                            <ListItem key={path}>
                                <Link passHref href={path}>
                                    <ListItemButton variant={selected ? 'soft' : undefined} color={selected ? 'primary' : undefined}>
                                        <ListItemDecorator sx={pathname === path ? { color: 'inherit' } : { color: 'neutral.500' }}>
                                            {icon}
                                        </ListItemDecorator>
                                        <ListItemContent>{title}</ListItemContent>
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        )
                    })}
                </List>
            </ListItem>
        </List>
    );
}
