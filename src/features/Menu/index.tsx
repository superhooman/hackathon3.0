import { AspectRatio, Box, Button, Card, CardOverflow, Chip, Stack, Typography } from "@mui/joy";
import Link from "next/link";
import React from "react";
import { useCart } from "../../context/cart";
import { trpc } from "../../utils/trpc"

interface ProductProps {
    title: string;
    category: string;
    id: number;
    price: number;
    image: string;
    description: string;
}

export const ProductCard: React.FC<ProductProps> = ({ title, category, price, image, id }) => {
    const { items, addToCart } = useCart();

    const inCart = React.useMemo(() => {
        const amount = items[id];
        return amount && (amount > 0);
    }, [items, id]);

    const handleAddToCart = React.useCallback(() => addToCart(id), [id, addToCart]);

    return (
        <Card variant="outlined">
            <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0.5 }}>
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
                            <Chip size="sm" variant="soft">{price} ₸</Chip>
                            <Chip size="sm" variant="outlined">{category}</Chip>
                        </Stack>
                    </Box>
                    {
                        inCart ? (
                            <Stack direction="row" spacing={0.5}>
                                <Link href="/cart" passHref>
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        color="primary"
                                        aria-label="Перейти в корзину"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        В корзину
                                    </Button>
                                </Link>
                                <Button
                                    variant="soft"
                                    size="sm"
                                    color="primary"
                                    aria-label="+1"
                                    sx={{ fontWeight: 600 }}
                                    onClick={handleAddToCart}
                                >
                                    +1
                                </Button>
                            </Stack>
                        ) : (
                            <Button
                                variant="solid"
                                size="sm"
                                color="primary"
                                aria-label="Добавить в корзину"
                                sx={{ fontWeight: 600 }}
                                onClick={handleAddToCart}
                            >
                                Добавить
                            </Button>
                        )
                    }
                </Box>
            </Box>
        </Card>
    )
}

export const Menu = () => {
    const { data } = trpc.useQuery(['menu.get']);

    return (
        <Stack direction="column" spacing={2}>
            {data?.map((item) => (
                <ProductCard
                    key={item.id}
                    title={item.item_name}
                    category={item.food_type}
                    price={item.price}
                    image={item.image}
                    id={item.id}
                    description={item.description}
                />
            ))}
        </Stack>
    );
};
