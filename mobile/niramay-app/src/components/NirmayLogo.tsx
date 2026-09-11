import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NirmayLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
}

export const NirmayLogo: React.FC<NirmayLogoProps> = ({
  size = 'medium',
  showSubtitle = true,
}) => {
  const iconSize = size === 'small' ? 36 : size === 'large' ? 72 : 52;
  const titleSize = size === 'small' ? 18 : size === 'large' ? 28 : 22;
  const subSize = size === 'small' ? 9 : size === 'large' ? 12 : 11;

  return (
    <View style={styles.container}>
      {/* Lotus icon mark */}
      <View style={[styles.iconWrapper, { width: iconSize, height: iconSize }]}>
        <View style={styles.lotusCluster}>
          {/* Top Center Petal */}
          <View style={[styles.petal, styles.petalCenter, { height: iconSize * 0.55, width: iconSize * 0.26 }]} />
          {/* Left Inner Petal */}
          <View style={[styles.petal, styles.petalLeftInner, { height: iconSize * 0.48, width: iconSize * 0.22 }]} />
          {/* Right Inner Petal */}
          <View style={[styles.petal, styles.petalRightInner, { height: iconSize * 0.48, width: iconSize * 0.22 }]} />
          {/* Left Outer Petal */}
          <View style={[styles.petal, styles.petalLeftOuter, { height: iconSize * 0.38, width: iconSize * 0.20 }]} />
          {/* Right Outer Petal */}
          <View style={[styles.petal, styles.petalRightOuter, { height: iconSize * 0.38, width: iconSize * 0.20 }]} />
        </View>
      </View>

      <Text style={[styles.title, { fontSize: titleSize }]}>NirmayNet</Text>
      {showSubtitle && (
        <Text style={[styles.subtitle, { fontSize: subSize }]}>
          Stronger Communities{'\n'}Healthier Tomorrows
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lotusCluster: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#0D9488',
  },
  petalCenter: {
    bottom: '22%',
    backgroundColor: '#059669',
    zIndex: 3,
  },
  petalLeftInner: {
    bottom: '22%',
    left: '26%',
    transform: [{ rotate: '-28deg' }],
    backgroundColor: '#0D9488',
    zIndex: 2,
  },
  petalRightInner: {
    bottom: '22%',
    right: '26%',
    transform: [{ rotate: '28deg' }],
    backgroundColor: '#0D9488',
    zIndex: 2,
  },
  petalLeftOuter: {
    bottom: '26%',
    left: '8%',
    transform: [{ rotate: '-56deg' }],
    backgroundColor: '#10B981',
    zIndex: 1,
  },
  petalRightOuter: {
    bottom: '26%',
    right: '8%',
    transform: [{ rotate: '56deg' }],
    backgroundColor: '#10B981',
    zIndex: 1,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
});
