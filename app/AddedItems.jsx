import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchItems, deleteItem } from "../utils/_api"; // ✅ API functions

const { width } = Dimensions.get("window");

const AddedItems = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchItems(); // ✅ Fetch items
      console.log("Fetched items:", data); // Debugging
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteItem(id); // ✅ Call API to delete item
              setItems(items.filter((item) => item._id !== id)); // ✅ Update state
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (id) => {
    router.push(`/EditItem/${id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Added Items</Text>
      </View>

      {items.length === 0 ? (
        <Text style={styles.noItemsText}>No items found.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {/* ✅ Image */}
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
                
              )}

              {/* ✅ Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.categoryText}>Category: {item.category?.name || "N/A"}</Text>

                {item.prices && item.prices.length > 0 ? (
                  item.prices.map((price, index) => (
                    <Text key={index} style={styles.priceText}>
                      {price.city}: ₹{price.price}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.priceText}>No pricing available</Text>
                )}
              </View>

              {/* ✅ Edit & Delete Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(item._id)} style={styles.editButton}>
                  <Ionicons name="create-outline" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  noItemsText: {
    color: "#888",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemImage: {
    width: width * 0.3, // 30% of screen width
    height: width * 0.3,
    borderRadius: 10,
    marginRight: 15,
  },
  placeholderImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 10,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  placeholderText: {
    color: "#FFF",
    fontSize: 14,
  },
  detailsContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  itemDescription: {
    fontSize: 14,
    color: "#AAA",
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: "#FFD700",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 14,
    color: "#0f0",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: 12,
  },
  deleteButton: {
    marginRight: 8,
  },
});

export default AddedItems;
