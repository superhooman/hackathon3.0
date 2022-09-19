import { ShoppingBag } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import { Badge, Box, IconButton, Typography } from "@mui/joy";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useCart } from "../../context/cart";
import { Logo } from "../Logo";

export const Header: React.FC<{ cart?: boolean }> = ({ cart = true }) => {
    const { data } = useSession();

    const { items } = useCart();

    const cartItemsCount = React.useMemo(() => Object.values(items).reduce((acc, item) => acc + item, 0), [items]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                flexGrow: 1,
            }}
        >
            <Logo height={36} width={36} />
            <Typography component="h1" fontWeight="xl">
                ZebraCoffee
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {data && cart ? (
                <Badge
                    badgeContent={cartItemsCount}
                >
                    <Link href="/cart" passHref>
                        <IconButton
                            variant="outlined"
                            size="sm"
                        >
                            <ShoppingBag />
                        </IconButton>
                    </Link>
                </Badge>
            ) : null}
            {data && !cart ? (
                <IconButton
                    variant="outlined"
                    size="sm"
                    onClick={() => signOut()}
                >
                    <LogoutIcon />
                </IconButton>
            ) : null}
        </Box>
    )
};
