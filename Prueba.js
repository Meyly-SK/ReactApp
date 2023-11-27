import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { agregarFoto, obtenerTodasLasFotos, eliminarFoto } from './Database';
import { useUsuarioContext } from './UsuarioContext';

const Prueba = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { usuarioId } = useUsuarioContext();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = React.useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [gallery, setGallery] = useState([]);

const openImageDetail = (photo) => {
  setSelectedImage(photo.url);
}

const closeImageDetail = () => {
  setSelectedImage(null);
}
  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);

      try {
        await agregarFoto(usuarioId, photo.uri);
        Alert.alert('Foto Agregada', 'La foto se ha agregado a la galería correctamente');
        cargarGaleria();
      } catch (error) {
        console.error('Error al agregar la foto a la base de datos:', error);
        Alert.alert('Error', 'No se pudo agregar la foto a la galería');
      }

      setIsCameraOpen(false);
    }
  };

  const cargarGaleria = async () => {
    try {
      const fotos = await obtenerTodasLasFotos();
      setGallery(fotos);
    } catch (error) {
      console.error('Error al obtener las fotos de la base de datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las fotos');
    }
  };

  const eliminarFotoHandler = (photoId) => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de que deseas eliminar esta foto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await eliminarFoto(photoId);
              Alert.alert('Foto Eliminada', 'La foto se ha eliminado correctamente');
              cargarGaleria();
            } catch (error) {
              console.error('Error al eliminar la foto de la base de datos:', error);
              Alert.alert('Error', 'No se pudo eliminar la foto');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      cargarGaleria();
    })();
  }, [usuarioId]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {isCameraOpen ? (
        <Camera
          style={{ flex: 1 }}
          type={cameraType}
          ref={(ref) => {
            cameraRef.current = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
              onPress={takePicture}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
              onPress={closeCamera}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
            {gallery.map((photo, index) => (
              <View key={index} style={{ width: '33.33%', padding: 5, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => openImageDetail(photo)}>
                  <Image source={{ uri: photo.url }} style={{ width: 100, height: 100, borderRadius: 10, marginBottom: 5 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarFotoHandler(photo.id)}>
                  <Text style={{ color: 'red' }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={{ width: '33.33%', padding: 5, alignItems: 'center' }}
              onPress={openCamera}
            >
              <Text style={{ fontSize: 24, color: 'blue' }}>Abrir Cámara</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      {selectedImage && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
          <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          <TouchableOpacity onPress={closeImageDetail} style={{ position: 'absolute', top: 20, right: 20 }}>
            <Text style={{ fontSize: 18, color: 'white' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Prueba;