import React, { useState, useRef, useEffect } from 'react';
import { Animated, Text, Modal, StyleSheet, Pressable, View, Animated, FlatList } from 'react-native';

const Root = Animated.createAnimatedComponent(Pressable);

const ScaleButton = ({ scale = 0.96, loading, ...props }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scaling = (toValue) =>
    Animated.spring(scaleAnim, { toValue, useNativeDriver: true }).start();
  return (
    <Root
      disabled={loading}
      onPressIn={() => scaling(scale)}
      onPressOut={() => scaling(1)}
      {...props}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
        transform: [...(props.style?.transform || []), { scale: scaleAnim }],
      }}
    />
  );
};

export default ({ textProps = {}, data = [], placeholder = "", label = "", hint, selected, onChange, ...props }) => {
  const [show, setShow] = useState(false);
  const labelTimeline = useRef(new Animated.Value(0)).current;
  const inputRange = [0, 1];

  const opacAnim = labelTimeline.interpolate({ inputRange, outputRange: [.5, 1] });
  const labelTranslateAnim = labelTimeline.interpolate({ inputRange, outputRange: [1, -20] });
  const labelScaleAnim = labelTimeline.interpolate({ inputRange, outputRange: [1, .7] });
  const animate = toValue => Animated.timing(labelTimeline, { toValue, duration: 100, useNativeDriver: true }).start();
  useEffect(() => animate(selected ? 1 : 0), [selected]);

  return (
    <>
      <ScaleButton onPress={() => setShow(true)} {...props} style={{ flex: 1 }}>
        <View style={styles.textContainer}>
          <Text {...textProps} children={data.find(d => d.value == selected)?.label || ' '} />
          <View style={styles.triangle} />
        </View>
        <Animated.Text style={{ position: 'absolute', fontSize: 14, opacity: opacAnim, transform: [{ scale: labelScaleAnim }, { translateY: labelTranslateAnim }] }} pointerEvents='none'>{selected && label || placeholder}</Animated.Text>
        {!!hint && !value && <Text style={{ color: '#00000055', fontSize: 12 }}>{hint}</Text>}
      </ScaleButton>
      <Modal
        animationType="slide"
        transparent
        visible={show}
        onRequestClose={() => setShow(false)}>
        <Pressable style={styles.centeredView} onPress={() => setShow(false)}>
          <View style={styles.modalBody}>
            <FlatList
              ListEmptyComponent={<Text style={{ margin: 5 }}>No data available</Text>}
              ItemSeparatorComponent={<View style={{ width: '90%', height: 1, backgroundColor: '#00000011', alignSelf: 'center' }} />}
              data={data.filter(d => d.value != selected)}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <ScaleButton onPress={() => { setShow(false); onChange?.(item.value) }} style={{ paddingVertical: 10, paddingHorizontal: 5 }}><Text>{item.label}</Text></ScaleButton>
              )} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
const size = 7;

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: size / 2,
    borderRightWidth: size / 2,
    borderBottomWidth: size,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "black",
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
    top: 5,
    transform: [{ rotate: "180deg" }],
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  modalBody: {
    margin: 20,
    width: '90%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContainer: { borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 5, overflow: 'hidden', width: '100%' }
});
