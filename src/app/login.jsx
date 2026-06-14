import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle, Svg } from "react-native-svg";
import Toast from "react-native-toast-message";
import { mockApi } from "../api/mock";
import { useAuthStore } from "../store/authStore";
import { Colors } from "../theme/colors";

export default function LoginScreen() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!username) {
      Toast.show({
        type: "info",
        text1: "Please enter your email.",
        position: "bottom",
      });
      return;
    }

    if (!password) {
      Toast.show({
        type: "info",
        text1: "Please enter your password.",
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await mockApi.login(username, password);
      await loginStore(response.user, response.token);
      Toast.show({
        type: "success",
        text1: "Successfully logged in! 👋",
        position: "bottom",
      });
      router.replace("/(tabs)/timesheet");
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={{ marginRight: 4 }}>
          <Svg width="24" height="24" viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke={Colors.warningOrange}
              strokeWidth="8"
              fill="none"
              opacity="0.3"
            />
            <Circle cx="50" cy="50" r="15" fill={Colors.purple} />
          </Svg>
        </View>
        <Text style={styles.logoText}>rbit</Text>
      </View>

      <Text style={styles.heading}>Welcome back!</Text>
      <Text style={styles.subheading}>Please sign in to continue</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={Colors.textMuted} />
              ) : (
                <Eye size={20} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
    paddingTop: 80,
    // justifyContent: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  subheading: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  passwordContainer: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  loginBtn: {
    height: 50,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
