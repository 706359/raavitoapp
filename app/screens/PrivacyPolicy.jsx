import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, HStack, Icon, Pressable, ScrollView, Text, VStack, useTheme } from 'native-base';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicy({ navigation }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg='#f9fafb'>
        {/* Premium Header with Gradient */}
        <Box
          style={styles.headerBox}
          bg={{
            linearGradient: {
              colors: [theme.colors.brand.orange, theme.colors.brand.green],
              start: [0, 0],
              end: [1, 1],
            },
          }}>
          <HStack style={styles.headerInner}>
            <HStack style={styles.headerLeft}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.headerBack}
                accessibilityRole='button'
                accessibilityLabel='Go back'>
                <Icon as={Ionicons} name='arrow-back' color='white' size={6} />
              </Pressable>
              <VStack>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <Text style={styles.headerSubtitle}>Your Privacy Matters to Us</Text>
              </VStack>
            </HStack>
            <Box style={styles.headerIconBox}>
              <Icon as={Ionicons} name='shield-checkmark' color='white' size={6} />
            </Box>
          </HStack>
        </Box>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <VStack space={4} px={5} py={5}>
            <Box style={styles.lastUpdatedBox}>
              <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>1. Introduction</Text>
              <Text style={styles.paragraph}>
                Welcome to Raavito. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food delivery application and website.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>2. Information We Collect</Text>
              <Text style={styles.subSectionTitle}>2.1 Personal Information</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Name, email address, phone number</Text>
                <Text style={styles.bulletItem}>• Delivery address and location data</Text>
                <Text style={styles.bulletItem}>• Payment information (processed securely through third-party providers)</Text>
                <Text style={styles.bulletItem}>• Profile picture and preferences</Text>
              </View>

              <Text style={styles.subSectionTitle}>2.2 Usage Information</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Order history and preferences</Text>
                <Text style={styles.bulletItem}>• Device information and IP address</Text>
                <Text style={styles.bulletItem}>• App usage patterns and interactions</Text>
                <Text style={styles.bulletItem}>• Location data (with your permission)</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
              <Text style={styles.paragraph}>We use your information to:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Process and deliver your orders</Text>
                <Text style={styles.bulletItem}>• Communicate with you about your orders</Text>
                <Text style={styles.bulletItem}>• Improve our services and user experience</Text>
                <Text style={styles.bulletItem}>• Send promotional offers and updates (with your consent)</Text>
                <Text style={styles.bulletItem}>• Ensure security and prevent fraud</Text>
                <Text style={styles.bulletItem}>• Comply with legal obligations</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>4. Data Sharing</Text>
              <Text style={styles.paragraph}>We may share your information with:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Kitchen partners for order fulfillment</Text>
                <Text style={styles.bulletItem}>• Delivery partners for order delivery</Text>
                <Text style={styles.bulletItem}>• Payment processors for transaction processing</Text>
                <Text style={styles.bulletItem}>• Service providers who assist in our operations</Text>
                <Text style={styles.bulletItem}>• Legal authorities when required by law</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>5. Data Security</Text>
              <Text style={styles.paragraph}>
                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>6. Your Rights</Text>
              <Text style={styles.paragraph}>You have the right to:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Access your personal information</Text>
                <Text style={styles.bulletItem}>• Correct inaccurate data</Text>
                <Text style={styles.bulletItem}>• Request deletion of your data</Text>
                <Text style={styles.bulletItem}>• Opt-out of marketing communications</Text>
                <Text style={styles.bulletItem}>• Withdraw consent at any time</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>7. Cookies and Tracking</Text>
              <Text style={styles.paragraph}>
                We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can manage cookie preferences through your device settings.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
              <Text style={styles.paragraph}>
                Our services are not intended for children under 18. We do not knowingly collect personal information from children.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
              <Text style={styles.paragraph}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>10. Contact Us</Text>
              <Text style={styles.paragraph}>If you have questions about this Privacy Policy, please contact us at:</Text>
              <View style={styles.contactBox}>
                <Text style={styles.contactItem}>Email: privacy@raavito.com</Text>
                <Text style={styles.contactItem}>Phone: +91-6395559255</Text>
                <Text style={styles.contactItem}>Address: Raavito, Noida Extension, India</Text>
              </View>
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerBox: {
    marginBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#f57506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  headerBack: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginTop: 2,
    opacity: 0.9,
  },
  headerIconBox: {
    padding: 10,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    paddingBottom: 40,
  },
  lastUpdatedBox: {
    backgroundColor: '#fff7ed',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9a3412',
    fontFamily: 'OpenSans',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#111827',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4b5563',
    fontFamily: 'OpenSans',
    marginBottom: 8,
  },
  bulletList: {
    marginTop: 8,
    marginBottom: 4,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 24,
    color: '#4b5563',
    fontFamily: 'OpenSans',
    marginBottom: 6,
    paddingLeft: 8,
  },
  contactBox: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contactItem: {
    fontSize: 14,
    lineHeight: 24,
    color: '#374151',
    fontFamily: 'OpenSans',
    marginBottom: 4,
  },
});

