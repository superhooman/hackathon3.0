import { Box } from "@mui/joy"
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps"
import { trpc } from "../../utils/trpc"

export const MapFeature = () => {
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
                            properties={{
                                hintContent: location.address,
                                balloonContent: location.address,
                            }}
                        />
                    ))}
                </Map>
            </YMaps>
        </Box>
    )
}