import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons"; // Install: expo install @expo/vector-icons
import profile from './dev.jpg'; // Import your image

const About = () => {
  const imageUrl = profile; // Replace with your image URL
  const portfolioUrl = "https://anishport.netlify.app"; // Replace with your portfolio URL
  const githubUrl = " "; // Replace with your GitHub URL
  const linkedinUrl = "https://www.linkedin.com/in/aanish-deshmukh-679666272/"; // Replace with your LinkedIn URL
  const twitterUrl = "YOUR_TWITTER_URL_HERE"; // Replace with your Twitter URL
  const instagramUrl = "YOUR_INSTAGRAM_URL_HERE"; // Replace with your Instagram URL

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Image source={profile} style={styles.profileImage} />
      <Text style={styles.name}>Aanish Deshmukh</Text>
      <Text style={styles.bio}>
        Passionate developer & cybergeek creating amazing things.
      </Text>

      <View style={styles.socialIcons}>
        <TouchableOpacity onPress={() => openLink(githubUrl)}>
          <FontAwesome name="github" size={30} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink(linkedinUrl)}>
          <FontAwesome name="linkedin" size={30} color="#0077B5" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink(twitterUrl)}>
          <FontAwesome name="twitter" size={30} color="#1DA1F2" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink(instagramUrl)}>
          <FontAwesome name="instagram" size={30} color="#E1306C" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink(portfolioUrl)}>
          <FontAwesome5 name="link" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#24f13",
    padding: 20,
  },
  profileImage: {
    width: 250,
    height: 350,
    
    borderRadius: 75,
    marginBottom: 20,
    shadowColor : "red",
    borderColor :"blue"
    },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 8,
    textShadowColor: "red",
    textShadowRadius : 2,
  },
  bio: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "silver",
    textShadowRadius : 1,
  },
  socialIcons: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor : 'silver',
    borderRadius : 10,

  },
  icon: {
    marginHorizontal: 15,

  },
});

export default About;