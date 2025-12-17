import React, { memo } from 'react';
import { View, Modal, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

import FastImage from 'react-native-fast-image';

interface Props {
    image: any;
    onClose: () => void;
}

export const ExerciseImageModal = memo(({ image, onClose }: Props) => {
    return (
        <Modal
            visible={!!image}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            {image && (
                                <FastImage
                                    source={image}
                                    style={styles.modalImage}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.l,
    },
    modalContent: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.l,
        padding: Theme.spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
});
