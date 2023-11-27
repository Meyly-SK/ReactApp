import { Camera } from 'expo-camera';
import { Permissions } from 'expo-permissions';

async function requestCameraPermission() {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  if (status === 'granted') {
  } else {
  }
}

export { requestCameraPermission };