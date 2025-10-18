import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function HeaderBar() {
  return (
    <View style={styles.header}>
      {/* Logo + Title */}
      <View style={styles.logoContainer}>
        <Svg width={24} height={24} viewBox="0 0 48 48" fill="none">
          <Path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="#137fec"/>
        </Svg>
        <Text style={styles.title}>TaskMaster</Text>
      </View>

      {/* Navigation Links */}
      <View style={styles.navLinks}>
        <Text style={styles.link}>My Tasks</Text>
        <Text style={[styles.link, styles.activeLink]}>Dashboard</Text>
        <Text style={styles.link}>Inbox</Text>
        <Text style={styles.link}>Projects</Text>
      </View>

      {/* Search + Profile */}
      <View style={styles.rightContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.notificationButton}>
          <Svg width={20} height={20} viewBox="0 0 256 256" fill="#137fec">
            <Path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/>
          </Svg>
        </TouchableOpacity>
        <Image
          source={{uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1RbnDeObJh2JDjJZntXt0LX84hG94ghDgB5_ZG-h5st2PYVfmDj4fExFPtFu-6KpuwRQ0yNTVo2PE21NOvBGY_aD1WBERRLBTnOMa87ajRmQtNspWuAH1CKTMbRlVRBYKgZRNkOLTzl-E-fwMnQpRbrGQNztmewQ1HJAjjATg_OG_fVbLTNiF2EDxFN8H55fLslrNS0MaHV52PCzc-Nps_vfYVs0Zs4PULuscS1vjp5l8Gip-OVzQHLvexm95v1wcmh9KHlh1UPtI"}}
          style={styles.profileImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#137fec",
  },
  navLinks: {
    flexDirection: "row",
    gap: 16,
  },
  link: {
    fontSize: 14,
    color: "#555",
  },
  activeLink: {
    color: "#137fec",
    fontWeight: "bold",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    height: 36,
    width: 150,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
