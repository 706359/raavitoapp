import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../theme';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('@/assets/download.jpeg'),
    icon: 'restaurant',
    title: 'Fresh Homemade Meals',
    description:
      'Discover authentic home-style tiffins from local kitchens. Every meal is prepared with love and care, just like home.',
    gradient: ['#f97316', '#ea580c'],
    features: ['100% Pure Veg', 'Home-Style Cooking', 'Fresh Daily'],
  },
  {
    id: '2',
    image: require('@/assets/download (1).jpeg'),
    icon: 'location',
    title: 'Fast & Reliable Delivery',
    description:
      'Get your favorite meals delivered right to your doorstep. Track your order in real-time and enjoy hot, fresh food.',
    gradient: ['#10b981', '#059669'],
    features: ['30-40 Min Delivery', 'Real-Time Tracking', 'Free Delivery*'],
  },
  {
    id: '3',
    image: require('@/assets/food.jpeg'),
    icon: 'heart',
    title: 'Healthy & Delicious',
    description:
      'Eat well, live well. Our meals are balanced, nutritious, and packed with flavor to keep you energized every day.',
    gradient: ['#8b5cf6', '#7c3aed'],
    features: ['Balanced Nutrition', 'Chef-Curated Menus', 'Daily Specials'],
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset animations on slide change
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    scaleAnim.setValue(0.8);
    iconRotate.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleDotPress = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleContinue = () => {
    navigation.replace('AuthStack');
  };

  const handleSkip = () => {
    navigation.replace('AuthStack');
  };

  if (user) return null;

  const currentSlide = slides[currentIndex];
  const iconRotation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Gradient */}
      <Animated.View
        style={[
          styles.gradientOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={currentSlide.gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slider */}
      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const isActive = currentIndex === index;
          return (
            <View style={styles.slide}>
              {/* Icon with Animation */}
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    opacity: isActive ? fadeAnim : 0.3,
                    transform: [
                      { scale: isActive ? scaleAnim : 0.8 },
                      { rotate: isActive ? iconRotation : '0deg' },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={item.icon} size={48} color='white' />
                </LinearGradient>
              </Animated.View>

              {/* Image Section */}
              <Animated.View
                style={[
                  styles.imageContainer,
                  {
                    opacity: isActive ? fadeAnim : 0.5,
                    transform: [{ scale: isActive ? scaleAnim : 0.9 }],
                  },
                ]}
              >
                <View style={styles.imageWrapper}>
                  <Image source={item.image} style={styles.image} resizeMode='cover' />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageGradient}
                  />
                </View>
              </Animated.View>

              {/* Text Section with Glassmorphism */}
              <Animated.View
                style={[
                  styles.textContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.textCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                    style={styles.textGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    {/* Features List */}
                    <View style={styles.featuresContainer}>
                      {item.features.map((feature, idx) => (
                        <View key={idx} style={styles.featureItem}>
                          <Ionicons
                            name='checkmark-circle'
                            size={18}
                            color={currentSlide.gradient[0]}
                            style={styles.featureIcon}
                          />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </LinearGradient>
                </View>
              </Animated.View>
            </View>
          );
        }}
      />

      {/* Enhanced Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={styles.dotWrapper}
              onPress={() => handleDotPress(index)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.dot,
                  isActive && styles.activeDot,
                  {
                    backgroundColor: isActive ? currentSlide.gradient[0] : '#d1d5db',
                    width: isActive ? 32 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <CustomButton
          title='Get Started'
          onPress={handleContinue}
          color='orange'
          style={styles.getStartedButton}
        />
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradient: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  skipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
  },
  iconContainer: {
    marginBottom: 24,
    zIndex: 5,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  imageContainer: {
    width: width * 0.85,
    height: height * 0.35,
    marginBottom: 32,
    zIndex: 2,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    width: width * 0.9,
    zIndex: 3,
  },
  textCard: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  textGradient: {
    padding: 28,
    borderRadius: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.8,
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 20,
    fontFamily: 'OpenSans',
  },
  featuresContainer: {
    marginTop: 8,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    fontFamily: 'OpenSans',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
    zIndex: 4,
  },
  dotWrapper: {
    padding: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  activeDot: {
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
    zIndex: 4,
  },
  getStartedButton: {
    width: '100%',
    shadowColor: theme.colors.brand.orange,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  termsText: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
    fontFamily: 'OpenSans',
  },
});
