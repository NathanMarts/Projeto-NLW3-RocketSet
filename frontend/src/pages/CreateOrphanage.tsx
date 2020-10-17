import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'
import { useHistory } from "react-router-dom";
import { FiX } from 'react-icons/fi'

import Sidebar from '../components/Sidebar'

import 'leaflet/dist/leaflet.css'

import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';

import MapIcon from '../utils/mapIcon'
import api from "../services/api";

export default function CreateOrphanage() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 })
  const history = useHistory()

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [open, setOpen] = useState('')
  const [close, setClose] = useState('')
  const [opening_hours, setOpening_hours] = useState('')
  const [open_on_weekends, setOpen_on_weekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImage, setpreviewImage] = useState<string[]>([])

  function handleMapClick(event: LeafletMouseEvent){
    const { lat, lng } = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    const { latitude, longitude } = position
    
    const data = new FormData()
    
    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
    images.forEach(image => {
      data.append('images', image)
    })
    
    await api.post('orphanages', data)

    alert('Cadastro realizado com sucesso!')

    history.push('/app')
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files)
      return

    const image = Array.from(event.target.files)
    
    setImages(image)

    const imagePreview = image.map(image => {
      return URL.createObjectURL(image)
    })

    setpreviewImage(imagePreview)
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-22.7157628, -43.5529695]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false} 
                  icon={MapIcon} 
                  position={[
                    position.latitude, 
                    position.longitude
                  ]} 
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                  {previewImage.map(image => {
                    return (
                      <div className='img-container'>
                        <div className='btn-close'><FiX color='#FF669D' size={30}/></div>
                        <img key={image} src={image} alt={name}/>
                      </div>
                    )
                  })}

                <label htmlFor="images[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                <input multiple onChange={handleSelectImages} type="file" id="images[]"/>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <label htmlFor="opening_hours">Abertura</label>
              <input type="time" id="opening_hours" value={open} onChange={event => setOpen(event.target.value)} />
              <label htmlFor="opening_hours">Fechamento</label>
              <input type="time" id="opening_hours" value={close} onChange={event => setClose(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button"
                  className={open_on_weekends ?'active': ''}
                  onClick={() => setOpen_on_weekends(true)}
                >
                    Sim
                </button>
                <button
                  type="button" 
                  className={!open_on_weekends ? 'active': ''} 
                  onClick={() => setOpen_on_weekends(false)} 
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit" onClick={() => setOpening_hours(`Dàs ${open} às ${close}`)}>
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
