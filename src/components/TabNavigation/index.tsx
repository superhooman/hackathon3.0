import { ListItemDecorator, Tab, TabList, Tabs, Typography } from "@mui/joy"

import CoffeeIcon from '@mui/icons-material/Coffee';
import RoomIcon from '@mui/icons-material/Room';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from "next/router";
import React from "react";

const TABS = [
  {
    label: 'Меню',
    icon: <CoffeeIcon />,
    href: '/',
  },
  {
    label: 'Локации',
    icon: <RoomIcon />,
    href: '/map',
  },
  {
    label: 'Профиль',
    icon: <AccountCircleIcon />,
    href: '/profile',
  },
]

export const TabNavigation = () => {
  const { pathname, push } = useRouter();

  const onChange = React.useCallback((path: string) => {
    push(path);
  }, [push]);

  return (
    <Tabs sx={{
      position: 'sticky',
      bottom: 0,
      width: '100%',
      backgroundColor: 'transparent',
    }} onChange={(_, path) => onChange(path as string)} aria-label="Icon tabs" value={pathname}>
      <TabList sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
      }}>
        {TABS.map(({ label, icon, href }) => (
          <Tab
            key={href}
            value={href}
            orientation="vertical"
            sx={{
              paddingY: 0.5,
            }}
          >
            <ListItemDecorator>
              {icon}
            </ListItemDecorator>
            <Typography fontSize="xs">{label}</Typography>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  )
}