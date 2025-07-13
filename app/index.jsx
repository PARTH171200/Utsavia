import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router'; 
import "./global.css"; 

export default function Page() {
  const router = useRouter(); 

  const handlePress = () => {
    router.push("/sign-up"); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo-small.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Utsavia</Text>
        </View>

        {/* Stylish Tagline Section */}
        <Text style={styles.slogan}>Bringing Your Vision to Life with the Perfect Decor</Text>

        {/* Additional Image with Oval Shape */}
        <Image
          source={require('../assets/images/index.png')} 
          style={styles.additionalImage}
          resizeMode="cover" 
        />
        
        {/* Continue with Email Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#000000", 
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
    alignItems: "center",
    textAlign: "center", 
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, 
    justifyContent: 'center',
  },
  logo: {
    width: 70,  
    height: 70, 
    marginRight: 15,
  },
  title: {
    fontSize: 60, 
    fontWeight: "bold",
    color: "#FFFFFF", 
  },
  slogan: {
    fontSize: 24,  
    fontWeight: "600",  
    color: "#FFD700", 
    textAlign: "center", 
    marginTop: 15, // Space between title and tagline
    marginBottom: 40, // Space between tagline and image
    letterSpacing: 1.5, // Add a bit of letter spacing for a sleek effect
    textShadowColor: '#000', // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset for depth
    textShadowRadius: 4, // Soft shadow radius
  },
  additionalImage: {
    width: 250,  // Increased width for the image
    height: 180, // Adjusted height to maintain the oval shape
    marginVertical: 40, // Adds more space between the image and the button
    borderRadius: 100, // To create an oval effect
    overflow: 'hidden', // Ensures the image stays within the rounded corners
  },
  button: {
    backgroundColor: '#FFD700', // Golden button color (gold)
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,  // More rounded corners for a softer button
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000', // Adding a shadow for depth
    shadowOffset: { width: 0, height: 10 }, // Offset for the shadow
    shadowOpacity: 0.3,  // Slight opacity for the shadow
    shadowRadius: 6,  // Radius for a soft shadow
    elevation: 5,  // Shadow effect for Android
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
