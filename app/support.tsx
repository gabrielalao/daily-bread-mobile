import colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { HelpCircle, Mail, Send } from "lucide-react-native";
import React, { useState } from "react";
import { useFocusEffect } from "expo-router";
import {
    Alert,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SupportScreen() {
    const email = "contactdailybreadapp@gmail.com";
    const scrollRef = React.useRef<ScrollView>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            scrollRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    const copyToClipboard = async (text: string, label: string) => {
        if (Platform.OS === "web" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                Alert.alert(
                    `${label} Copied`,
                    `${label} "${text}" has been copied to your clipboard.`,
                    [{ text: "OK" }]
                );
            } catch (error) {
                Alert.alert(
                    label,
                    `${label}: ${text}`,
                    [{ text: "OK" }]
                );
            }
        } else {
            Alert.alert(
                label,
                `${label}: ${text}`,
                [{ text: "OK" }]
            );
        }
    };

    const handleEmailPress = async () => {
        const url = `mailto:${email}`;
        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                await copyToClipboard(email, "Email");
            }
        } catch (error) {
            await copyToClipboard(email, "Email");
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
            Alert.alert(
                "Missing Information",
                "Please fill in all fields before submitting.",
                [{ text: "OK" }]
            );
            return;
        }

        setIsSubmitting(true);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert(
                "Invalid Email",
                "Please enter a valid email address.",
                [{ text: "OK" }]
            );
            setIsSubmitting(false);
            return;
        }

        try {
            const subject = encodeURIComponent(formData.subject);
            const body = encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            );
            const url = `mailto:${email}?subject=${subject}&body=${body}`;

            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
                // Clear form after successful submission
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
                Alert.alert(
                    "Email Opened",
                    "Your email client should open with the message pre-filled. Please send it to complete your support request.",
                    [{ text: "OK" }]
                );
            } else {
                // Fallback: show the email content
                Alert.alert(
                    "Email Information",
                    `To: ${email}\nSubject: ${formData.subject}\n\nFrom: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`,
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "Unable to open email client. Please contact us directly at " + email,
                [{ text: "OK" }]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.light.background, colors.light.cardBackground]}
                style={StyleSheet.absoluteFillObject}
            />
            <ScrollView
                ref={scrollRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <HelpCircle size={32} color={colors.light.primary} />
                        </View>
                        <Text style={styles.title}>Support</Text>
                        <Text style={styles.subtitle}>Get Help & Answer Your Questions</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.intro}>
                            Need help with Daily Bread? Fill out the form below or contact us directly. We&apos;ll respond promptly to your inquiry.
                        </Text>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your name"
                                    placeholderTextColor={colors.light.textSecondary}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="your.email@example.com"
                                    placeholderTextColor={colors.light.textSecondary}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Subject *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="What is this regarding?"
                                    placeholderTextColor={colors.light.textSecondary}
                                    value={formData.subject}
                                    onChangeText={(text) => setFormData({ ...formData, subject: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Message *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Tell us how we can help..."
                                    placeholderTextColor={colors.light.textSecondary}
                                    value={formData.message}
                                    onChangeText={(text) => setFormData({ ...formData, message: text })}
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                                activeOpacity={0.8}
                            >
                                <Send size={20} color="#fff" style={styles.submitIcon} />
                                <Text style={styles.submitButtonText}>
                                    {isSubmitting ? "Opening Email..." : "Send Message"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Or Contact Us Directly</Text>
                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={handleEmailPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.contactIconContainer}>
                                <Mail size={24} color={colors.light.primary} />
                            </View>
                            <View style={styles.contactTextContainer}>
                                <Text style={styles.contactLabel}>Email</Text>
                                <Text style={styles.contactValue}>{email}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
        alignItems: "center",
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${colors.light.primary}15`,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700" as const,
        color: colors.light.text,
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: colors.light.textSecondary,
        lineHeight: 22,
        textAlign: "center",
    },
    card: {
        backgroundColor: colors.light.cardBackground,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.light.border,
        marginBottom: 20,
    },
    intro: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.light.text,
        marginBottom: 24,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600" as const,
        color: colors.light.text,
    },
    input: {
        backgroundColor: colors.light.background,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: colors.light.text,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    textArea: {
        minHeight: 120,
        paddingTop: 14,
    },
    submitButton: {
        backgroundColor: colors.light.primary,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitIcon: {
        marginRight: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "700" as const,
        color: "#fff",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700" as const,
        color: colors.light.text,
        marginBottom: 16,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: `${colors.light.primary}08`,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    contactIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${colors.light.primary}15`,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    contactTextContainer: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: "600" as const,
        color: colors.light.textSecondary,
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: "600" as const,
        color: colors.light.text,
    },
});