import { View, Image, TouchableOpacity, Text } from "react-native";
import { HeaderProps } from "../constants/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { useRouter } from "expo-router";

export default function Header({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) {
  const router = useRouter();
  const { itemCount } = { itemCount: 3 };
  return (
    <View className="flex-row items-center justify-between bg-white px-4 py-3">
      {/* { leftSide } */}
      <View className="flex-row items-center flex-1">
        {showMenu && (
          <TouchableOpacity className="mr-3">
            <Ionicons name="menu-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showLogo ? (
          <View className="flex-1">
            <Image
              source={require("../assets/images/logo.png")}
              style={{ width: "100%", height: 24 }}
              resizeMode="contain"
            />
          </View>
        ) : (
          title && (
            <Text className="text-xl font-bold text-pretty text-center flex-1 mr-8">
              {title}
            </Text>
          )
        )}
        {/* {!title && !showSearch && <View className="flex-1" />} */}
      </View>

      {/* { rightSide } */}
      <View className="flex-row items-center">
        {showSearch && (
          <TouchableOpacity className="mr-3">
            <Ionicons name="search-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity>
            <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
            {itemCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {itemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
