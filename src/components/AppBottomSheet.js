import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Pressable, Platform, Modal } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS 
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors, s } from '../constant/theme';
import AppText from './AppText';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AppBottomSheet = forwardRef(({ title, children, onApply, onClear }, ref) => {
  const [visible, setVisible] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const closeSheet = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withSpring(SCREEN_HEIGHT, { 
      damping: 30,
      stiffness: 150,
      overshootClamping: true
    }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
      }
    });
  };

  const openSheet = () => {
    setVisible(true);
    backdropOpacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, {
      damping: 25,
      stiffness: 120,
      overshootClamping: true,
    });
  };

  useImperativeHandle(ref, () => ({
    open: openSheet,
    close: closeSheet
  }));

  // Improved Gesture logic to avoid ScrollView conflict
  const panGesture = Gesture.Pan()
    .activeOffsetY(20) // Only activate if swiping down more than 20px
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        runOnJS(closeSheet)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={closeSheet}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <AnimatedPressable 
            onPress={closeSheet}
            style={[styles.backdrop, animatedBackdropStyle]} 
          />

          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.sheet, animatedSheetStyle]}>
              <View style={styles.handle} />
              
              <View style={styles.header}>
                <TouchableOpacity onPress={onClear} activeOpacity={0.7} style={styles.headerBtn}>
                  <AppText color={colors.gray} style={styles.headerBtnText}>Reset</AppText>
                </TouchableOpacity>
                
                <AppText variant="subtitle" style={styles.title}>{title}</AppText>
                
                <TouchableOpacity 
                  onPress={() => { onApply(); closeSheet(); }} 
                  style={[styles.headerBtn, styles.applyBtn]} 
                  activeOpacity={0.7}
                >
                  <AppText color={colors.white} style={styles.applyText}>Apply</AppText>
                </TouchableOpacity>
              </View>
              
              <View style={styles.body}>
                {children}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(15, 23, 42, 0.75)' 
  },
  sheet: { 
    backgroundColor: colors.white, 
    borderTopLeftRadius: s(30), 
    borderTopRightRadius: s(30), 
    height: SCREEN_HEIGHT * 0.45, 
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    zIndex: 999
  },
  handle: { 
    width: s(35), 
    height: s(5), 
    backgroundColor: '#E2E8F0', 
    borderRadius: s(2.5), 
    alignSelf: 'center', 
    marginTop: s(12),
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: s(20),
    paddingTop: s(6), 
    paddingBottom: s(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  title: { 
    fontWeight: '800', 
    fontSize: s(15), 
    color: colors.dark,
  },
  headerBtn: { paddingHorizontal: s(10), paddingVertical: s(6) },
  headerBtnText: { fontWeight: '700', fontSize: s(12) },
  applyBtn: { backgroundColor: colors.primary, borderRadius: s(12), paddingHorizontal: s(18), paddingVertical: s(6) },
  applyText: { fontWeight: '900', fontSize: s(12), color: colors.white },
  body: { 
    flex: 1, 
    paddingBottom: Platform.OS === 'ios' ? s(35) : s(15),
  }
});

export default AppBottomSheet;
