import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const avatars = [
  "https://res.cloudinary.com/dzwismxgx/image/upload/v1784828191/avatar4_l2qasx.png",
  "https://res.cloudinary.com/dzwismxgx/image/upload/v1784828125/avatar2_fawkq8.png",
  "https://res.cloudinary.com/dzwismxgx/image/upload/v1784828125/avatar3_ru2gdw.png",
  "https://res.cloudinary.com/dzwismxgx/image/upload/v1784828124/avatar1_q9qwmz.png",
];

const SignUpScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [profileImage, setProfileImage] = useState(null);



  const handleSignup = () => {
    console.log({
      username,
      email,
      password,
      image: profileImage,
      avatar: selectedAvatar,
    });

  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <Image
          source={{
            uri: profileImage || selectedAvatar,
          }}
          style={styles.profileImage}
        />




        {/* Avatars */}
        <Text style={styles.avatarTitle}>Or Choose an Avatar</Text>
        <View style={{ flexDirection: "row", marginBottom: 30 }}>
          {avatars.map((avatar, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedAvatar(avatar);
                setProfileImage(null);
              }}
            >
              <Image
                source={{ uri: avatar }}
                style={[ styles.avatar, selectedAvatar === avatar && !profileImage && styles.selectedAvatar ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Username"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
        >
          <Text style={styles.signupText}>Create Account</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.textSecondary, marginTop: 20 }}>
          Already have an account? <Text onPress={() => navigation.goBack()} style={{ color: colors.primary }}>Login</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 25,
      paddingVertical: 40,
      alignItems: "center",
    },

    profileImage: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 3,
      borderColor: colors.primary,
      marginBottom: 10,
    },

    uploadText: {
      color: colors.primary,
      fontWeight: "600",
      marginBottom: 25,
    },

    avatarTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },

    avatar: {
      width: 65,
      height: 65,
      borderRadius: 33,
      marginRight: 12,
      borderWidth: 2,
      borderColor: "transparent",
    },

    selectedAvatar: {
      borderColor: colors.primary,
    },

    input: {
      width: "100%",
      backgroundColor: colors.primaryLight,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
      marginBottom: 18,
    },

    signupButton: {
      width: "100%",
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },

    signupText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
  })