import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  getHardwareInfo,
  showToast,
  subscribeToDevicePing,
  triggerNativePing,
  getDeviceConstants,
  type HardwareInfo,
} from 'react-native-device-helper';

export default function App() {
  const [info, setInfo] = useState<HardwareInfo | null>(null);
  const [eventMsg, setEventMsg] = useState<string>('');
  const constants = getDeviceConstants();

  useEffect(() => {
    const unsubscribe = subscribeToDevicePing((event) => {
      setEventMsg(
        `${event.message} lúc ${new Date(event.timestamp).toLocaleTimeString()}`
      );
    });
    return () => unsubscribe();
  }, []);

  const handleReadHardware = async () => {
    try {
      const data = await getHardwareInfo();
      setInfo(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Example App: Device Helper</Text>
      {constants && (
        <View style={styles.box}>
          <Text>
            Thiết bị: {constants.MANUFACTURER} {constants.MODEL}
          </Text>
          <Text>Android OS: {constants.ANDROID_VERSION}</Text>
        </View>
      )}

      <Button title="1. Đọc RAM & Pin từ Native" onPress={handleReadHardware} />
      {info && (
        <View style={styles.box}>
          <Text>
            RAM trống: {info.availRamMb} MB / {info.totalRamMb} MB
          </Text>
          <Text>
            Pin: {info.batteryLevel}% (Đang sạc:{' '}
            {info.isCharging ? 'Có' : 'Không'})
          </Text>
        </View>
      )}

      <View style={styles.spacer} />
      <Button
        title="2. Bắn Android Toast"
        onPress={() => showToast('Xin chào từ Thư Viện Dùng Chung!')}
      />

      <View style={styles.spacer} />
      <Button
        title="3. Bắn Event Native -> JS"
        onPress={() => triggerNativePing('Ping từ Example App!')}
      />
      {eventMsg !== '' && <Text style={styles.eventText}>{eventMsg}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  spacer: {
    height: 12,
  },
  eventText: {
    marginTop: 12,
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
