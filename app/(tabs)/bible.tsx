import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, BookOpen, List } from 'lucide-react-native';
import colors from '@/constants/colors';
import { BIBLE_BOOKS, BibleBook } from '@/constants/bibleBooks';
import { fetchBibleChapter, BibleChapter, getBibleAPITranslation } from '@/utils/bibleAPI';
import { useContent } from '@/contexts/ContentContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

const BIBLE_READING_KEY = 'bible_reading_position';

interface ReadingPosition {
  bookId: string;
  chapter: number;
}

export default function BibleScreen() {
  const { userPreferences } = useContent();
  const [currentBook, setCurrentBook] = useState<BibleBook>(BIBLE_BOOKS[0]); // Genesis
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);

  // Load saved reading position on mount
  useEffect(() => {
    loadReadingPosition();
  }, []);

  // Fetch chapter when book or chapter changes
  useEffect(() => {
    loadChapter();
  }, [currentBook, currentChapter, userPreferences.bibleVersion]);

  const loadReadingPosition = async () => {
    try {
      const saved = await AsyncStorage.getItem(BIBLE_READING_KEY);
      if (saved) {
        const position: ReadingPosition = JSON.parse(saved);
        const book = BIBLE_BOOKS.find(b => b.id === position.bookId);
        if (book) {
          setCurrentBook(book);
          setCurrentChapter(position.chapter);
        }
      }
    } catch (error) {
      console.error('Error loading reading position:', error);
    }
  };

  const saveReadingPosition = async (bookId: string, chapter: number) => {
    try {
      const position: ReadingPosition = { bookId, chapter };
      await AsyncStorage.setItem(BIBLE_READING_KEY, JSON.stringify(position));
    } catch (error) {
      console.error('Error saving reading position:', error);
    }
  };

  const loadChapter = async () => {
    setLoading(true);
    const translation = getBibleAPITranslation(userPreferences.bibleVersion);
    const data = await fetchBibleChapter(currentBook.id, currentChapter, translation);
    setChapterData(data);
    setLoading(false);
    saveReadingPosition(currentBook.id, currentChapter);
  };

  const goToPreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else {
      // Go to previous book's last chapter
      const currentIndex = BIBLE_BOOKS.findIndex(b => b.id === currentBook.id);
      if (currentIndex > 0) {
        const prevBook = BIBLE_BOOKS[currentIndex - 1];
        setCurrentBook(prevBook);
        setCurrentChapter(prevBook.chapters);
      }
    }
  };

  const goToNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter(currentChapter + 1);
    } else {
      // Go to next book's first chapter
      const currentIndex = BIBLE_BOOKS.findIndex(b => b.id === currentBook.id);
      if (currentIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currentIndex + 1];
        setCurrentBook(nextBook);
        setCurrentChapter(1);
      }
    }
  };

  const selectBook = (book: BibleBook) => {
    setCurrentBook(book);
    setCurrentChapter(1);
    setShowBookPicker(false);
  };

  const selectChapter = (chapter: number) => {
    setCurrentChapter(chapter);
    setShowChapterPicker(false);
  };

  const hasPrevious = () => {
    return currentChapter > 1 || BIBLE_BOOKS.findIndex(b => b.id === currentBook.id) > 0;
  };

  const hasNext = () => {
    return currentChapter < currentBook.chapters || 
           BIBLE_BOOKS.findIndex(b => b.id === currentBook.id) < BIBLE_BOOKS.length - 1;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Navigation Header */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, !hasPrevious() && styles.navButtonDisabled]}
          onPress={goToPreviousChapter}
          disabled={!hasPrevious()}
        >
          <ChevronLeft size={24} color={hasPrevious() ? colors.light.primary : colors.light.border} />
        </TouchableOpacity>

        <View style={styles.navigationCenter}>
          <TouchableOpacity style={styles.bookButton} onPress={() => setShowBookPicker(true)}>
            <BookOpen size={18} color={colors.light.primary} />
            <Text style={styles.bookButtonText}>{currentBook.name}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chapterButton} onPress={() => setShowChapterPicker(true)}>
            <List size={16} color={colors.light.textSecondary} />
            <Text style={styles.chapterButtonText}>Chapter {currentChapter}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.navButton, !hasNext() && styles.navButtonDisabled]}
          onPress={goToNextChapter}
          disabled={!hasNext()}
        >
          <ChevronRight size={24} color={hasNext() ? colors.light.primary : colors.light.border} />
        </TouchableOpacity>
      </View>

      {/* Chapter Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.light.primary} />
            <Text style={styles.loadingText}>Loading {currentBook.name} {currentChapter}...</Text>
          </View>
        ) : chapterData ? (
          <View style={styles.chapterContainer}>
            <Text style={styles.chapterTitle}>
              {currentBook.name} {currentChapter}
            </Text>
            <Text style={styles.versionBadge}>{userPreferences.bibleVersion.toUpperCase()}</Text>
            
            <View style={styles.versesContainer}>
              {chapterData.verses.map((verse) => (
                <View key={verse.verse} style={styles.verseRow}>
                  <Text style={styles.verseNumber}>{verse.verse}</Text>
                  <Text style={styles.verseText}>{verse.text}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load chapter</Text>
            <Text style={styles.errorSubtext}>Please check your internet connection or try again later.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadChapter}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Book Picker Modal */}
      <Modal
        visible={showBookPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Book</Text>
              <TouchableOpacity onPress={() => setShowBookPicker(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={BIBLE_BOOKS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.bookItem,
                    item.id === currentBook.id && styles.bookItemActive
                  ]}
                  onPress={() => selectBook(item)}
                >
                  <View>
                    <Text style={[
                      styles.bookItemName,
                      item.id === currentBook.id && styles.bookItemNameActive
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={styles.bookItemDetails}>
                      {item.testament === 'OT' ? 'Old Testament' : 'New Testament'} • {item.chapters} chapters
                    </Text>
                  </View>
                  {item.id === currentBook.id && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Chapter Picker Modal */}
      <Modal
        visible={showChapterPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChapterPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.chapterModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentBook.name} - Select Chapter</Text>
              <TouchableOpacity onPress={() => setShowChapterPicker(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chapterGrid}>
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((chapter) => (
                <TouchableOpacity
                  key={chapter}
                  style={[
                    styles.chapterGridItem,
                    chapter === currentChapter && styles.chapterGridItemActive
                  ]}
                  onPress={() => selectChapter(chapter)}
                >
                  <Text style={[
                    styles.chapterGridText,
                    chapter === currentChapter && styles.chapterGridTextActive
                  ]}>
                    {chapter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.light.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: colors.light.border,
    opacity: 0.3,
  },
  navigationCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.light.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.primary,
  },
  chapterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chapterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: isTablet ? 32 : (isSmallScreen ? 16 : 20),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  chapterContainer: {
    gap: 16,
  },
  chapterTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  versionBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.accent,
    backgroundColor: `${colors.light.accent}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  versesContainer: {
    gap: 12,
  },
  verseRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.accent,
    minWidth: 32,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 28,
    color: colors.light.text,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.light.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  chapterModal: {
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.primary,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  bookItemActive: {
    backgroundColor: `${colors.light.primary}10`,
  },
  bookItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  bookItemNameActive: {
    color: colors.light.primary,
  },
  bookItemDetails: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light.primary,
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  chapterGridItem: {
    width: (screenWidth - 80) / 6,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  chapterGridItemActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  chapterGridText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  chapterGridTextActive: {
    color: '#FFFFFF',
  },
});
