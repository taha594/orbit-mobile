import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Circle, Defs, RadialGradient, Stop, Svg } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A0F1E", "#0A0F1E"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Background Glowing Sphere */}
      <View style={styles.glowContainer}>
        <Svg height="400" width="400">
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#0A0F1E" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="200" cy="200" r="200" fill="url(#grad)" />
        </Svg>
      </View>

      <View style={styles.content}>
        <View style={styles.logoRow}>
          <View style={styles.orbitIcon}>
            <Svg width="40" height="40" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F97316"
                strokeWidth="8"
                fill="none"
                opacity="0.3"
              />
              <Circle cx="50" cy="50" r="15" fill="#8B5CF6" />
            </Svg>
          </View>
          <Text style={styles.logoText}>rbit</Text>
        </View>
        <Text style={styles.tagline}>Work. Track. Grow.</Text>
      </View>

      <View style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1E",
    justifyContent: "center",
    alignItems: "center",
  },
  glowContainer: {
    position: "absolute",
    bottom: -100,
    left: -100,
  },
  content: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orbitIcon: {
    marginRight: 4,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "700",
    color: "white",
  },
  tagline: {
    color: "white",
    fontSize: 14,
    fontWeight: "300",
    letterSpacing: 2,
    marginTop: 12,
    textTransform: "uppercase",
  },
  indicator: {
    position: "absolute",
    bottom: 20,
    width: 100,
    height: 5,
    backgroundColor: "white",
    borderRadius: 2.5,
  },
});
