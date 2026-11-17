import {
  View,
  Image,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  type ScrollViewInstance,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { BANNERS, dummyProducts } from "@/assets/assets";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { CATEGORIES } from "../../../constants";
import CategoryItem from "../../../components/CategoryItem";
import { Product } from "../../../constants/types";
import ProductCard from "../../../components/ProductCard";

const { width } = Dimensions.get("window");
const bannerWidth = width - 29;

export default function Home() {
  const router = useRouter();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollViewInstance | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  // const [visibleProductCount, setVisibleProductCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const hasLoadedMoreRef = useRef(false);
  const catogries = [{ id: "all", name: "All", icon: "grid" }, ...CATEGORIES];

  useEffect(() => {
    setProducts(dummyProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (BANNERS.length < 2) return;

    const interval = setInterval(() => {
      const nextIndex = (activeBannerIndex + 1) % BANNERS.length;
      setActiveBannerIndex(nextIndex);
      bannerScrollRef.current?.scrollTo({
        x: nextIndex * bannerWidth,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBannerIndex]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header showMenu showLogo showCart />
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } =
            event.nativeEvent;
          const isNearBottom =
            contentOffset.y + layoutMeasurement.height >= contentSize.height - 100;

          if (!isNearBottom) {
            hasLoadedMoreRef.current = false;
            return;
          }

          // if (
          //   !hasLoadedMoreRef.current &&
          //   !loading &&
          //   visibleProductCount < products.length
          // ) {
          //   hasLoadedMoreRef.current = true;
          //   setVisibleProductCount((count) =>
          //     Math.min(count + 10, products.length),
          //   );
          // }
        }}
      >
        <View className="mb-6">
          {/* Banner Slider */}
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="w-full h-48 rounded-xl"
            style={{
              width: bannerWidth,
              height: 192,
              borderRadius: 12,
              overflow: "hidden",
            }}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) =>
              setActiveBannerIndex(
                Math.round(event.nativeEvent.contentOffset.x / bannerWidth),
              )
            }
          >
            {BANNERS.map((banner, index) => (
              <View
                key={index}
                className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-200"
                style={{ width: bannerWidth }}
              >
                <Image
                  source={{ uri: banner.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute bottom-4 left-4 z-10">
                  <Text className="text-white text-2xl font-bold">
                    {banner.title}
                  </Text>
                  <Text className="text-white text-sm font-medium">
                    {banner.subtitle}
                  </Text>
                  <TouchableOpacity className="mt-2 bg-white px-4 py-2 rounded-full self-start">
                    <Text className="text-primary font-bold text-xs">
                      Get Now
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="absolute inset-0 bg-black opacity-20" />
              </View>
            ))}
          </ScrollView>
          {/* Pagination Dots */}
          <View className="flex-row justify-center mt-2">
            {BANNERS.map((_, index) => (
              <View
                key={index}
                className={`mx-1 h-2 rounded-full ${
                  index === activeBannerIndex ? "w-6" : "w-2"
                }`}
                style={{
                  backgroundColor:
                    index === activeBannerIndex ? "#111111" : "#D1D5DB",
                }}
              />
            ))}
          </View>
        </View>
        {/* Categories  */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-pretty">Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {catogries.map((cat: any) => (
              <CategoryItem
                key={cat.id}
                item={cat}
                isSelected={false}
                onPress={() =>
                  router.push({
                    pathname: "/", //To Fix
                    params: { catogry: cat.id === "all" ? "" : cat.name },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>
        {/* Popular Products */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Popular</Text>
            <TouchableOpacity onPress={() => router.push('/',)}> 
              <Text className="text-secondary text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          { loading ? (
            <ActivityIndicator size= 'large'/>  
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {products.slice(0, 4).map((product)=> (
                  <ProductCard key={product._id} product={product} />
                ))}
              </View>
            )}
        </View>
        {/* Newsletter CTA */}
        <View className="bg-gray-100 p-6 rounded-md mb-10 items-center">
          <Text className="text-2xl font-bold text-primary mb-2 text-center">Join the Revolution</Text>
          <Text className="text-secondary text-center mb-4">Subscribe to our newsletter and get 10% off your first purchase.</Text>
          <TouchableOpacity className="bg-primary w-4/5 py-3 rounded-full items-center">
            <Text className="text-white font-medium text-base">Subscribe Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
