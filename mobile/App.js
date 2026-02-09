import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

// URL de Produção
const SITE_URL = "https://imoveis-caragua.vercel.app";

// Configuração do handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");
  const webViewRef = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);
    });
  }, []);

  // Injetar token no WebView quando ele terminar de carregar
  const injectTokenScript = `
    window.postMessage(JSON.stringify({
      type: 'EXPO_PUSH_TOKEN',
      token: '${expoPushToken}'
    }), '*');
  `;

  const handleLoadEnd = () => {
    setIsLoading(false);
    if (expoPushToken && webViewRef.current) {
      webViewRef.current.injectJavaScript(injectTokenScript);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        ref={webViewRef}
        source={{ uri: SITE_URL }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Falha ao obter permissão para notificações push!");
      return;
    }

    // Obter o Project ID do eas.json ou app.json automaticamente
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      console.log(e);
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
  } else {
    // alert("Must use physical device for Push Notifications");
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
  },
});
