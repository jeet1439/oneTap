import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import ScreenLayout from "../components/ScreenLayout";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const BASE_URL = "http://192.168.0.101:5000/api";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_COLUMNS = 3;
const GRID_GAP = 2;

const SCREEN_LAYOUT_HORIZONTAL_PADDING = 18;
const AVAILABLE_WIDTH =
  SCREEN_WIDTH - SCREEN_LAYOUT_HORIZONTAL_PADDING * 2;
const TILE_SIZE =
  (AVAILABLE_WIDTH - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ friends: 0, friendRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [error, setError] = useState(null);

  const [bioModalVisible, setBioModalVisible] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ---- Fetch profile (GET /users/me) + stats (GET /users/me/stats) ----
  const fetchProfile = useCallback(async () => {
    try {
      setError(null);

      const [profileRes, statsRes] = await Promise.all([
        fetch(`${BASE_URL}/users/me`, {
          method: "GET",
          headers: authHeaders,
        }),
        fetch(`${BASE_URL}/users/me/stats`, {
          method: "GET",
          headers: authHeaders,
        }),
      ]);

      const profileData = await profileRes.json();

      if (!profileRes.ok || !profileData.success) {
        throw new Error(profileData.message || "Failed to load profile");
      }

      setProfile(profileData.user);

      // Stats are secondary — don't fail the whole screen if this endpoint has an issue
      const statsData = await statsRes.json();

      if (statsRes.ok && statsData.success) {
        setStats({
          friends: statsData.stats.friends,
          friendRequests: statsData.stats.friendRequests,
        });
      } else {
        console.log("fetchStats error:", statsData.message);
      }
    } catch (err) {
      console.log("fetchProfile error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  // ---- Shared helper: pick an image and upload it to Cloudinary, returns secure_url ----
  const pickAndUploadToCloudinary = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (result.didCancel) return null;

    if (result.errorCode) {
      Alert.alert("Error", result.errorMessage || "Could not open gallery");
      return null;
    }

    const asset = result.assets && result.assets[0];
    if (!asset) return null;

    // 1. Get signed params from our backend
    const sigRes = await fetch(`${BASE_URL}/images/signature`, {
      method: "GET",
      headers: authHeaders,
    });

    const sigData = await sigRes.json();

    if (!sigRes.ok || !sigData.success) {
      throw new Error(sigData.message || "Failed to get upload signature");
    }

    const { signature, timestamp, cloudName, apiKey, folder } = sigData;

    // 2. Upload directly to Cloudinary
    const form = new FormData();
    form.append("file", {
      uri: asset.uri,
      type: asset.type || "image/jpeg",
      name: asset.fileName || "upload.jpg",
    });
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok || !uploadData.secure_url) {
      throw new Error(uploadData.error?.message || "Upload to Cloudinary failed");
    }

    return uploadData.secure_url;
  };

  const handleUploadImage = async () => {
    try {
      setUploading(true);

      const secureUrl = await pickAndUploadToCloudinary();
      if (!secureUrl) return; 


      const saveRes = await fetch(`${BASE_URL}/users/photos`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: secureUrl }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.message || "Failed to save photo");
      }

      // Update local state so the grid reflects the new photo immediately
      setProfile((prev) => ({
        ...prev,
        featuredPhotos: [...(prev?.featuredPhotos || []), saveData.photo],
      }));
    } catch (err) {
      console.log("handleUploadImage error:", err);
      Alert.alert("Upload failed", err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  // ---- Tap avatar: pick -> upload -> PUT /users/profile with new image url ----
  const handleChangeAvatar = async () => {
    try {
      setUpdatingAvatar(true);

      const secureUrl = await pickAndUploadToCloudinary();
      if (!secureUrl) return;

      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: secureUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile photo");
      }

      setProfile((prev) => ({ ...prev, image: data.user.image }));
    } catch (err) {
      console.log("handleChangeAvatar error:", err);
      Alert.alert("Update failed", err.message || "Something went wrong");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  // ---- Long press bio: open modal to edit ----
  const openBioEditor = () => {
    setBioDraft(profile?.bio || "");
    setBioModalVisible(true);
  };

  const handleSaveBio = async () => {
    try {
      setSavingBio(true);

      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio: bioDraft.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update bio");
      }

      setProfile((prev) => ({ ...prev, bio: data.user.bio }));
      setBioModalVisible(false);
    } catch (err) {
      console.log("handleSaveBio error:", err);
      Alert.alert("Update failed", err.message || "Something went wrong");
    } finally {
      setSavingBio(false);
    }
  };

  // ---- Delete a featured photo (long press) ----
  const handleDeletePhoto = (photo) => {
    Alert.alert("Delete photo", "Remove this photo from your profile?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${BASE_URL}/users/photos/${photo.id}`, {
              method: "DELETE",
              headers: authHeaders,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
              throw new Error(data.message || "Failed to delete photo");
            }

            setProfile((prev) => ({
              ...prev,
              featuredPhotos: prev.featuredPhotos.filter((p) => p.id !== photo.id),
            }));
          } catch (err) {
            console.log("handleDeletePhoto error:", err);
            Alert.alert("Error", err.message || "Could not delete photo");
          }
        },
      },
    ]);
  };
  if (loading) {
    return (
      <ScreenLayout showNotification={false}>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.primary || colors.text} />
        </View>
      </ScreenLayout>
    );
  }

  // ---- Error state ----
  if (error && !profile) {
    return (
      <ScreenLayout showNotification={false}>
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchProfile}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  const photos = profile?.featuredPhotos || [];

  return (
    <ScreenLayout showNotification={false}>
      <FlatList
        data={photos}
        numColumns={GRID_COLUMNS}
        key={`grid-${GRID_COLUMNS}`} 
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.profileHeader}>
              <TouchableOpacity onPress={handleChangeAvatar} activeOpacity={0.8} disabled={updatingAvatar}>
                <Image
                  source={{
                    uri: profile?.image || "https://i.pravatar.cc/300?img=12",
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.avatarEditBadge}>
                  {updatingAvatar ? (
                    <ActivityIndicator size="small" color={colors.background} />
                  ) : (
                    <Ionicons name="camera" size={14} color={colors.background} />
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile?.username || "No name set"}</Text>
                <TouchableOpacity onLongPress={openBioEditor} activeOpacity={0.7}>
                  <Text style={styles.about} numberOfLines={3}>
                    {profile?.bio || "No bio yet. Long press to add one."}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.friends}</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.friendRequests}</Text>
                <Text style={styles.statLabel}>Requests</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{photos.length}</Text>
                <Text style={styles.statLabel}>Photos</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Uploaded Images</Text>

              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={handleUploadImage}
                activeOpacity={0.7}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={18} color={colors.background} />
                    <Text style={styles.uploadBtnText}>Upload</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const isLastInRow = (index + 1) % GRID_COLUMNS === 0;

          return (
            <TouchableOpacity
              onLongPress={() => handleDeletePhoto(item)}
              activeOpacity={0.85}
              style={[
                styles.tileWrapper,
                { marginRight: isLastInRow ? 0 : GRID_GAP },
              ]}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.uploadedImage} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No photos yet. Tap Upload to add one.</Text>
        }
      />

      <Modal
        visible={bioModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBioModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit bio</Text>

            <TextInput
              style={styles.bioInput}
              value={bioDraft}
              onChangeText={setBioDraft}
              placeholder="Tell people about yourself..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={200}
              autoFocus
            />

            <Text style={styles.charCount}>{bioDraft.length}/200</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnGhost]}
                onPress={() => setBioModalVisible(false)}
                disabled={savingBio}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSolid]}
                onPress={handleSaveBio}
                disabled={savingBio}
              >
                {savingBio ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Text style={styles.modalBtnSolidText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenLayout>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    centerFill: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },

    errorText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 12,
      textAlign: "center",
    },

    retryBtn: {
      backgroundColor: colors.primary || colors.text,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },

    retryBtnText: {
      color: colors.background,
      fontWeight: "600",
    },

    listContent: {
      paddingBottom: 20,
    },

    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },

    profileImage: {
      width: 75,
      height: 75,
      borderRadius: 50,
    },

    avatarEditBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.primary || colors.text,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },

    modalCard: {
      width: "100%",
      backgroundColor: colors.card || colors.surface || colors.background,
      borderRadius: 16,
      padding: 20,
    },

    modalTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },

    bioInput: {
      minHeight: 90,
      maxHeight: 160,
      borderWidth: 1,
      borderColor: colors.border || colors.textSecondary,
      borderRadius: 10,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      textAlignVertical: "top",
    },

    charCount: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "right",
      marginTop: 6,
    },

    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 16,
      gap: 10,
    },

    modalBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 20,
      minWidth: 80,
      alignItems: "center",
      justifyContent: "center",
    },

    modalBtnGhost: {
      backgroundColor: "transparent",
    },

    modalBtnGhostText: {
      color: colors.textSecondary,
      fontWeight: "600",
      fontSize: 13,
    },

    modalBtnSolid: {
      backgroundColor: colors.primary || colors.text,
    },

    modalBtnSolidText: {
      color: colors.background,
      fontWeight: "600",
      fontSize: 13,
    },

    profileInfo: {
      flex: 1,
      marginLeft: 20,
    },

    name: {
      fontSize: 23,
      fontWeight: "700",
      color: colors.text,
    },
    about: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      marginTop: 8,
    },

    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card || colors.surface,
      borderRadius: 14,
      paddingVertical: 14,
      marginTop: 0,
    },

    statItem: {
      flex: 1,
      alignItems: "center",
    },

    statDivider: {
      width: 1,
      height: 28,
      backgroundColor: colors.border || colors.textSecondary,
      opacity: 0.3,
    },

    statNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },

    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 30,
      marginBottom: 15,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    uploadBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary || colors.text,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      gap: 6,
      minWidth: 90,
      justifyContent: "center",
    },

    uploadBtnText: {
      color: colors.background,
      fontSize: 13,
      fontWeight: "600",
    },

    tileWrapper: {
      marginBottom: GRID_GAP,
    },

    uploadedImage: {
      width: TILE_SIZE,
      height: TILE_SIZE,
      backgroundColor: colors.card || colors.surface, 
      borderRadius: 0,
    },

    emptyText: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 20,
      paddingHorizontal: 16,
    },
  });

export default ProfileScreen;