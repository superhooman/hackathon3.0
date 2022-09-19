import { Close } from "@mui/icons-material";
import { Box, Button, Chip, CircularProgress, IconButton, ListDivider, Option, Select, Stack, Typography } from "@mui/joy";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useSession } from "next-auth/react";
import React from "react";
import { useCart } from "../../context/cart";
import { trpc } from "../../utils/trpc";
import { ProductCard } from "../Menu";

interface CartItemProps {
    id: number;
    title: string;
    price: number;
    image: string;
    amount: number;
    category: string;
    removeFromCart: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ id, title, price, image, amount, category, removeFromCart }) => {
    const handleRemove = React.useCallback(() => removeFromCart(id), [id, removeFromCart]);
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
            <img
                src={image}
                alt={title}
                style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain'
                }}
            />
            <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                    <Typography level="h2" fontSize="md" sx={{ alignSelf: 'flex-start' }}>
                        {title}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                        <Chip size="sm" variant="outlined">{category}</Chip>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                        <Chip size="sm" variant="soft">{price} ₸</Chip>
                        {amount > 1 ? <Chip size="sm" variant="soft">⨉ {amount} шт.</Chip> : null}
                    </Stack>
                </Box>
            </Box>
            <IconButton
                aria-label="Удалить из корзины"
                onClick={handleRemove}
                size="sm"
                color="neutral"
            >
                <Close />
            </IconButton>
        </Box>
    )
};

interface MapFeatureProps {
    onChange: (location: number) => void;
}

export const MapFeature: React.FC<MapFeatureProps> = ({ onChange }) => {
    const { data } = trpc.useQuery(['locations.get']);

    return (
        <Box sx={{
            margin: -2,
            flexGrow: 1,
            height: 'calc(100% + 32px)',
            width: 'calc(100% + 32px)',
        }}>
            <YMaps>
                <Map height="100%" width="100%" defaultState={{ center: [51.090643, 71.397716], zoom: 15 }}>
                    {data?.map((location) => (
                        <Placemark
                            key={location.id}
                            geometry={[location.lat, location.lon]}
                            onClick={() => onChange(location.id)}
                        />
                    ))}
                </Map>
            </YMaps>
        </Box>
    )
}

export const Cart = () => {
    const { items, removeFromCart } = useCart();
    const { data: session } = useSession();
    const { data } = trpc.useQuery(['menu.get']);
    const { data: locations } = trpc.useQuery(['locations.get']);
    const { data: discount } = trpc.useQuery(['discount.getDiscounts', (session?.user?.id) || ''], {
        enabled: Boolean(session),
    });
    const [screen, setScreen] = React.useState<'cart' | 'map'>('cart')
    const [selected, setSelected] = React.useState(-1);

    const { mutateAsync: checkout } = trpc.useMutation('order.userOrder');

    const totalCost = React.useMemo(() => {
        if (!data) {
            return 0;
        }
        return Object.entries(items).reduce((acc, [id, amount]) => {
            const item = data.find((item) => item.id === Number(id));
            if (!item) {
                return acc;
            }
            return acc + (item.price * amount) * (1 - (discount?.amount ?? 0) / 100);
        }, 0);
    }, [items, data, discount]);

    const handleCheckout = React.useCallback(() => {
        if (selected === -1) {
            return;
        }
        checkout({
            items,
            location_id: selected,
            total: totalCost,
        }).then((data) => {
            if (!data) {
                return;
            }
            window.location.href = data;
        });
    }, [checkout, selected, items, totalCost]);

    const cartItemsCount = React.useMemo(() => {
        return Object.values(items).reduce((acc, curr) => acc + curr, 0);
    }, [items]);

    const menuItemsNotInCart = React.useMemo(() => {
        if (!data) {
            return [];
        }
        return data.filter((item) => !items[item.id]).slice(0, 1);
    }, [data, items]);

    const handleSelectLocation = React.useCallback((id: number) => {
        setSelected(id);
        setScreen('cart');
    }, []);

    const selectedLocation = React.useMemo(() => {
        return locations?.find((location) => location.id === selected);
    }, [selected, locations]);

    if (!data) {
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

    if (cartItemsCount < 1) {
        return (
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography>Пусто</Typography>
            </Box>
        )
    }

    if (screen === 'map') {
        return (
            <MapFeature onChange={handleSelectLocation} />
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {
                Object.entries(items).map(([id, amount]) => {
                    const item = data.find(item => item.id === Number(id));
                    if (!item) return null;
                    return (
                        <CartItem
                            key={item.id}
                            id={item.id}
                            title={item.item_name}
                            price={item.price}
                            image={item.image}
                            amount={amount}
                            category={item.food_type}
                            removeFromCart={removeFromCart}
                        />
                    )
                })
            }
            <ListDivider />
            {
                discount ? (
                    <Stack direction="row" sx={{
                        justifyContent: 'space-between',
                        paddingY: 1
                    }}>
                        <Typography level="h2" fontSize="md">
                            Скидка
                        </Typography>
                        <Typography level="h2" fontSize="md">
                            {discount.amount}%
                        </Typography>
                    </Stack>
                ) : null
            }
            <Stack direction="row" sx={{
                justifyContent: 'space-between',
                paddingY: 1
            }}>
                <Typography level="h2" fontSize="md">
                    Итого
                </Typography>
                <Typography level="h2" fontSize="md">
                    {totalCost} ₸
                </Typography>
            </Stack>
            <Button variant="soft" onClick={() => setScreen('map')}>
                {selectedLocation ? selectedLocation.address : 'Выбрать локацию'}
            </Button>
            <Button disabled={!selectedLocation} onClick={handleCheckout}>К оплате</Button>
            <ListDivider sx={{
                marginY: 2
            }} />
            {menuItemsNotInCart.length > 0 ? <Typography level="h2" fontSize="md">Люди похожие на вас заказывают:</Typography> : null}
            <Stack sx={{
                marginY: 2
            }}  spacing={2}>
                {menuItemsNotInCart.map((item) => (
                    <ProductCard
                        title={item.item_name}
                        price={item.price}
                        image={item.image}
                        category={item.food_type}
                        key={item.id}
                        id={item.id}
                        description={item.description}
                    />
                ))}
            </Stack>
        </Box>
    )
}