import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiArrowRight } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import mapMarkerImg from '../images/map-marker.svg'

import api from '../services/api'

import '../styles/pages/orphanage-map.css'
import MapIcon from '../utils/mapIcon'

interface orphanage {
    id: number
    latitude: number
    longitude: number
}
function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState([])

    useEffect(() => {
        api.get('orphanages').then(res => {
            setOrphanages(res.data)
        })
    }, [])

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Rio de Janeiro</strong>
                    <span>Queimados</span>
                </footer>
            </aside>

            <Map
                center={[-22.7157628, -43.5529695]}
                zoom={14.5}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {orphanages.map(orphanages => {
                    return (
                        <Marker icon={MapIcon} position={[-22.7157628, -43.5529695]}>
                            <Popup closeButton={false} minWidth={240} maxHeight={240} className='map-popup' >
                                Lar das meninas
                            <Link to="/orphanages/1">
                                    <FiArrowRight size={20} color="#FFFF" />
                                </Link>
                            </Popup>
                        </Marker>
                    )
                }}
            </Map>

            <Link to="/orphanages/create" className='create-orphanage'>
                <FiPlus size={32} color='#FFFF' />
            </Link>
        </div>
    );
}

export default OrphanagesMap;