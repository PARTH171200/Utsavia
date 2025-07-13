import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBookings, confirmBooking } from "../utils/_api";

const CombinedBookings = () => {
  const router = useRouter();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNewBookings, setHasNewBookings] = useState(false);

useEffect(() => {
  const loadBookings = async () => {
    try {
      const data = await fetchBookings(); // Assuming fetchBookings fetches data from backend
      // Ensure the data has the expected structure
      if (data && Array.isArray(data.pending)) {
        setPendingBookings(data.pending);
        setConfirmedBookings(data.confirmed);
        setCancelledBookings(data.cancelled);
        setHasNewBookings(data.hasNewBookings); // Set notification state
      } else {
        console.error("Unexpected data format:", data);
        setError("Failed to load bookings.");
      }
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };
  loadBookings();
}, []);


  const handleConfirm = async (bookingId) => {
    try {
      await confirmBooking(bookingId);

      // Move booking from pending to confirmed list
      setPendingBookings((prev) => prev.filter((b) => b._id !== bookingId));
      const newlyConfirmed = pendingBookings.find((b) => b._id === bookingId);
      if (newlyConfirmed) {
        setConfirmedBookings((prev) => [...prev, { ...newlyConfirmed, status: "confirmed" }]);
      }

      Alert.alert("Success", "Booking confirmed successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to confirm booking.");
    }
  };

  // Filtered bookings based on selected tab
  const filteredBookings = {
    pending: pendingBookings,
    confirmed: confirmedBookings,
    cancelled: cancelledBookings,
  }[selectedTab];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["pending", "confirmed", "cancelled"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSelectedTab(status)}
            style={[styles.tab, selectedTab === status && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === status && styles.activeTabText]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Notification Icon */}
        {hasNewBookings && <Ionicons name="notifications" size={24} color="#FFD700" />}
      </View>

      {/* Bookings List */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : filteredBookings.length === 0 ? (
        <Text style={styles.noBookings}>No {selectedTab} bookings found.</Text>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingTile booking={item} onConfirm={selectedTab === "pending" ? handleConfirm : null} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const BookingTile = ({ booking, onConfirm }) => (
  <View style={styles.tile}>
    <Text style={styles.tileText}>Total: ₹{booking.totalAmount}</Text>
    <Text style={styles.tileText}>Date: {new Date(booking.createdAt).toDateString()}</Text>
    <Text style={styles.tileText}>Time Slot: {booking.items[0]?.timeSlot}</Text>
    <Text style={styles.tileText}>
      Location: {booking.address.street}, {booking.address.city}, {booking.address.state}, {booking.address.zipCode}, {booking.address.country}
    </Text>
    {onConfirm && (
      <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(booking._id)}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noBookings: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  activeTab: {
    backgroundColor: "#FFD700",
  },
  tabText: {
    fontSize: 16,
    color: "#FFF",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  tile: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#FFD700",
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  tileText: {
    fontSize: 16,
    color: "#DDD",
    marginTop: 4,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default CombinedBookings;
