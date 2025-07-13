import { StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
title,
handlePress,
containerStyles,
textStyles,
isLoading,
}) => {
return (
    <TouchableOpacity
    onPress={handlePress}
    activeOpacity={0.7}
    style={[
        styles.button,
        {
        minHeight: 64, 
        paddingHorizontal: 16,
        borderRadius: 16,
        width:'100%'
        },
        isLoading ? styles.disabled : null,
        containerStyles,
    ]}
    disabled={isLoading}
    >
    
    <Text style={[styles.buttonText, textStyles]}>{title}</Text>

    {isLoading && (
        <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size="small"
        className="ml-2"
        />
    )}
    </TouchableOpacity>
);
};
const styles=StyleSheet.create({
    button: {
        backgroundColor: 'gold',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#2C2C34',
        paddingVertical: 12,
        minHeight: 64, 
      },
    
      buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
      },
      loading: {
        marginLeft: 10,
      },
    disabled: {
        opacity: 0.5,
    },
})

export default CustomButton;