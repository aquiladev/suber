import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

export default function SimpleMap(props) {
	return (
		<section style={{ height: 300 }}>
			<GoogleMapLoader
				containerElement={
					<div {...props.containerElementProps} style={{ height: "100%" }} />
				}
				googleMapElement={
					<GoogleMap
						ref={(map) => console.log(map) }
						defaultZoom={12}
						defaultCenter={{ lat: 50.4515772, lng: 30.5207877 }}
						onClick={props.onMapClick}
						>
						{props.markers.map((marker, index) => {
							return <Marker {...marker} onRightclick={() => props.onMarkerRightclick(index) } />;
						}) }
					</GoogleMap>
				}
				/>
		</section>
	);
}