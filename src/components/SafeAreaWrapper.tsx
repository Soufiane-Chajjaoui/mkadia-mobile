// src/components/SafeAreaWrapper.tsx
import React, { ReactNode } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
}

export default function SafeAreaWrapper({ children }: Props) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F5E9" },
  container: { flex: 1 },
});
