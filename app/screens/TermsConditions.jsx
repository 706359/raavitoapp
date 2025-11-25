import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, Icon, Pressable, ScrollView, Text, VStack, useTheme } from 'native-base';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsConditions({ navigation }) {
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
                <Text style={styles.headerTitle}>Terms & Conditions</Text>
                <Text style={styles.headerSubtitle}>Please Read Carefully</Text>
              </VStack>
            </HStack>
            <Box style={styles.headerIconBox}>
              <Icon as={Ionicons} name='document-text' color='white' size={6} />
            </Box>
          </HStack>
        </Box>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <VStack space={4} px={5} py={5}>
            <Box style={styles.lastUpdatedBox}>
              <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.paragraph}>
                By accessing and using the Raavito application and website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>2. Use of Service</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• You must be at least 18 years old to use our services</Text>
                <Text style={styles.bulletItem}>• You are responsible for maintaining the confidentiality of your account</Text>
                <Text style={styles.bulletItem}>• You agree to provide accurate and complete information</Text>
                <Text style={styles.bulletItem}>• You will not use the service for any illegal or unauthorized purpose</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>3. Ordering and Payment</Text>
              <Text style={styles.subSectionTitle}>3.1 Placing Orders</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Orders are subject to availability</Text>
                <Text style={styles.bulletItem}>• Prices are subject to change without notice</Text>
                <Text style={styles.bulletItem}>• We reserve the right to refuse or cancel orders</Text>
                <Text style={styles.bulletItem}>• Delivery times are estimates and not guaranteed</Text>
              </View>

              <Text style={styles.subSectionTitle}>3.2 Payment</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Payment must be made at the time of order or upon delivery</Text>
                <Text style={styles.bulletItem}>• We accept cash on delivery, online payments, and digital wallets</Text>
                <Text style={styles.bulletItem}>• All prices are inclusive of applicable taxes</Text>
                <Text style={styles.bulletItem}>• Refunds will be processed as per our refund policy</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>4. Delivery</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Delivery charges may apply based on location</Text>
                <Text style={styles.bulletItem}>• We deliver to the address provided by you</Text>
                <Text style={styles.bulletItem}>• You must be available to receive the order</Text>
                <Text style={styles.bulletItem}>• We are not responsible for delays due to circumstances beyond our control</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>5. Cancellation and Refunds</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Orders can be cancelled before preparation begins</Text>
                <Text style={styles.bulletItem}>• Refunds will be processed within 5-7 business days</Text>
                <Text style={styles.bulletItem}>• Cancellation charges may apply for prepared orders</Text>
                <Text style={styles.bulletItem}>• No refunds for delivered orders unless there's a quality issue</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>6. Food Quality and Safety</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• We ensure all food is prepared in hygienic conditions</Text>
                <Text style={styles.bulletItem}>• All our food is 100% vegetarian</Text>
                <Text style={styles.bulletItem}>• If you have allergies, please inform us before ordering</Text>
                <Text style={styles.bulletItem}>• Report any quality issues immediately for resolution</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>7. User Conduct</Text>
              <Text style={styles.paragraph}>You agree not to:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Use the service for any unlawful purpose</Text>
                <Text style={styles.bulletItem}>• Impersonate any person or entity</Text>
                <Text style={styles.bulletItem}>• Interfere with the service's operation</Text>
                <Text style={styles.bulletItem}>• Attempt to gain unauthorized access to any part of the service</Text>
              </View>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
              <Text style={styles.paragraph}>
                All content, logos, trademarks, and materials on Raavito are the property of Raavito and are protected by copyright and trademark laws. You may not use, reproduce, or distribute any content without our written permission.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
              <Text style={styles.paragraph}>
                Raavito shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to food quality issues, delivery delays, or service interruptions.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>10. Modifications to Service</Text>
              <Text style={styles.paragraph}>
                We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice. We are not liable to you or any third party for any modification or discontinuation.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>11. Governing Law</Text>
              <Text style={styles.paragraph}>
                These Terms and Conditions are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Noida, India.
              </Text>
            </Box>

            <Box style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>12. Contact Information</Text>
              <Text style={styles.paragraph}>For questions about these Terms and Conditions, contact us at:</Text>
              <View style={styles.contactBox}>
                <Text style={styles.contactItem}>Email: support@raavito.com</Text>
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

