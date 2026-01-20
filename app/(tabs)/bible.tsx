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
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react-native';
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
  
  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchStep, setSearchStep] = useState<'book' | 'chapter'>('book');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchBook, setSelectedSearchBook] = useState<BibleBook | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<BibleBook[]>(BIBLE_BOOKS);

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

  // Search functionality
  const openSearch = () => {
    setShowSearch(true);
    setSearchStep('book');
    setSearchQuery('');
    setSelectedSearchBook(null);
    setFilteredBooks(BIBLE_BOOKS);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchStep('book');
    setSelectedSearchBook(null);
    Keyboard.dismiss();
  };

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    
    if (searchStep === 'book') {
      // Filter books by name
      const filtered = BIBLE_BOOKS.filter(book =>
        book.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  const handleBookSelect = (book: BibleBook) => {
    setSelectedSearchBook(book);
    setSearchStep('chapter');
    setSearchQuery('');
  };

  const handleChapterSelect = (chapter: number) => {
    if (selectedSearchBook) {
      setCurrentBook(selectedSearchBook);
      setCurrentChapter(chapter);
      closeSearch();
    }
  };

  const getFilteredChapters = () => {
    if (!selectedSearchBook) return [];
    
    const allChapters = Array.from({ length: selectedSearchBook.chapters }, (_, i) => i + 1);
    
    if (!searchQuery) return allChapters;
    
    // Filter chapters that start with the search query
    return allChapters.filter(ch => ch.toString().startsWith(searchQuery));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity 
            style={styles.topPillButton} 
            onPress={() => setShowBookPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.topPillText}>
              {currentBook.name} {currentChapter}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.chapterPillButton} 
            onPress={() => setShowChapterPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.chapterPillText}>
              {chapterData && 
               chapterData.verses.length > 0 && 
               chapterData.chapter === currentChapter &&
               chapterData.book === currentBook.id
                ? `1-${chapterData.verses[chapterData.verses.length - 1].verse}`
                : loading ? '...' : '...'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchButton} activeOpacity={0.7} onPress={openSearch}>
          <Search size={24} color={colors.light.text} />
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

      {/* Floating Navigation Arrows */}
      {!loading && chapterData && (
        <View style={styles.floatingNav}>
          <TouchableOpacity
            style={[styles.floatingNavButton, styles.floatingNavLeft, !hasPrevious() && styles.floatingNavDisabled]}
            onPress={goToPreviousChapter}
            disabled={!hasPrevious()}
            activeOpacity={0.7}
          >
            <ChevronLeft 
              size={36} 
              color={hasPrevious() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)'} 
              strokeWidth={3}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.floatingNavButton, styles.floatingNavRight, !hasNext() && styles.floatingNavDisabled]}
            onPress={goToNextChapter}
            disabled={!hasNext()}
            activeOpacity={0.7}
          >
            <ChevronRight 
              size={36} 
              color={hasNext() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)'} 
              strokeWidth={3}
            />
          </TouchableOpacity>
        </View>
      )}

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
              <View>
                <Text style={styles.modalTitle}>{currentBook.name}</Text>
                <Text style={styles.modalSubtitle}>
                  {currentBook.chapters} {currentBook.chapters === 1 ? 'Chapter' : 'Chapters'}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowChapterPicker(false)}
                style={styles.closeButton}
              >
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              contentContainerStyle={styles.chapterGrid}
              showsVerticalScrollIndicator={false}
            >
              {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((chapter) => (
                <TouchableOpacity
                  key={chapter}
                  style={[
                    styles.chapterGridItem,
                    chapter === currentChapter && styles.chapterGridItemActive
                  ]}
                  onPress={() => selectChapter(chapter)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.chapterGridText,
                    chapter === currentChapter && styles.chapterGridTextActive
                  ]}>
                    {chapter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Search Modal */}
      <Modal
        visible={showSearch}
        animationType="slide"
        transparent={true}
        onRequestClose={closeSearch}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.searchModalOverlay}
        >
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={Keyboard.dismiss}
          />
          <View style={styles.searchModalContent}>
            {/* Search Header */}
            <View style={styles.searchHeader}>
              <Text style={styles.searchTitle}>
                {searchStep === 'book' ? 'Search Book' : `${selectedSearchBook?.name} - Select Chapter`}
              </Text>
              <TouchableOpacity onPress={closeSearch} style={styles.searchCloseButton}>
                <X size={24} color={colors.light.text} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.light.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder={searchStep === 'book' ? 'Type book name...' : 'Type chapter number...'}
                placeholderTextColor={colors.light.textSecondary}
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                autoFocus
                keyboardType={searchStep === 'chapter' ? 'numeric' : 'default'}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={20} color={colors.light.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Step Indicator */}
            {searchStep === 'chapter' && (
              <TouchableOpacity 
                style={styles.backToBookButton}
                onPress={() => {
                  setSearchStep('book');
                  setSearchQuery('');
                  setSelectedSearchBook(null);
                }}
              >
                <Text style={styles.backToBookText}>← Back to book selection</Text>
              </TouchableOpacity>
            )}

            {/* Results */}
            <ScrollView 
              style={styles.searchResults}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {searchStep === 'book' ? (
                // Book Results
                filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <TouchableOpacity
                      key={book.id}
                      style={styles.searchResultItem}
                      onPress={() => handleBookSelect(book)}
                    >
                      <View>
                        <Text style={styles.searchResultName}>{book.name}</Text>
                        <Text style={styles.searchResultDetails}>
                          {book.testament === 'OT' ? 'Old Testament' : 'New Testament'} • {book.chapters} chapters
                        </Text>
                      </View>
                      <ChevronRight size={20} color={colors.light.textSecondary} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>No books found</Text>
                  </View>
                )
              ) : (
                // Chapter Results
                <View style={styles.chapterSearchGrid}>
                  {getFilteredChapters().map((chapter) => (
                    <TouchableOpacity
                      key={chapter}
                      style={styles.chapterSearchItem}
                      onPress={() => handleChapterSelect(chapter)}
                    >
                      <Text style={styles.chapterSearchText}>{chapter}</Text>
                    </TouchableOpacity>
                  ))}
                  {getFilteredChapters().length === 0 && (
                    <View style={styles.noResults}>
                      <Text style={styles.noResultsText}>No chapters found</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.light.background,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  topPillButton: {
    backgroundColor: colors.light.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  topPillText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  chapterPillButton: {
    backgroundColor: colors.light.cardBackground,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.light.border,
    minWidth: 50,
    alignItems: 'center',
  },
  chapterPillText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  searchButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.light.cardBackground,
  },
  bottomNavButtonDisabled: {
    opacity: 0.3,
  },
  // Floating Navigation
  floatingNav: {
    position: 'absolute',
    bottom: 15, // 15px from the bottom
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    pointerEvents: 'box-none', // Allow touches to pass through empty space
    height: 80,
    alignItems: 'center',
  },
  floatingNavButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(30, 30, 30, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingNavLeft: {
    // Left button specific styles if needed
  },
  floatingNavRight: {
    // Right button specific styles if needed
  },
  floatingNavDisabled: {
    backgroundColor: 'rgba(60, 60, 60, 0.4)',
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
    marginBottom: 100, // Reserve space for navigation arrows
    marginTop: 10, // Optimized space at top for reading
  },
  scrollContent: {
    padding: isTablet ? 32 : (isSmallScreen ? 16 : 20),
    paddingTop: 10, // Reduced top padding for better reading area
    paddingBottom: 40,
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
    flex: 1,
  },
  versesContainer: {
    gap: 16,
  },
  verseRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  verseNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textSecondary,
    minWidth: 28,
    paddingTop: 2,
  },
  verseText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 30,
    color: colors.light.text,
    fontWeight: '400',
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: `${colors.light.primary}10`,
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
    padding: 20,
    paddingTop: 16,
    gap: 10,
  },
  chapterGridItem: {
    width: (screenWidth - 100) / 5,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.light.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chapterGridItemActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chapterGridText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
  },
  chapterGridTextActive: {
    color: '#FFFFFF',
  },
  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  searchModalContent: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    paddingBottom: 20,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    flex: 1,
  },
  searchCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.cardBackground,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
    padding: 0,
  },
  backToBookButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 8,
  },
  backToBookText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.primary,
  },
  searchResults: {
    flex: 1,
    marginTop: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  searchResultName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  searchResultDetails: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  chapterSearchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
  },
  chapterSearchItem: {
    width: (screenWidth - 90) / 5,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.light.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  chapterSearchText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: colors.light.textSecondary,
  },
});
