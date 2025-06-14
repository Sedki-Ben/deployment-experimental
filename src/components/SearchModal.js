import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX, FiClock, FiStar, FiHeart, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { GiBoxingGlove } from 'react-icons/gi';
import { useTranslation } from 'react-i18next';
import { articles as articlesAPI } from '../services/api';
import { getLocalizedArticleContent } from '../hooks/useArticles';

const SearchModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchInputRef = useRef(null);
  const isRTL = i18n.language === 'ar';

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        limit: 10,
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      };
      
      const response = await articlesAPI.search(searchQuery, params);
      setResults(response.data.articles || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(t('Search failed. Please try again.'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'etoile-du-sahel':
        return <FiStar className="w-4 h-4 text-red-500" />;
      case 'the-beautiful-game':
        return <span className="text-green-500">⚽</span>;
      case 'all-sports-hub':
        return <GiBoxingGlove className="w-4 h-4 text-purple-500" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryName = (category) => {
    const translations = {
      'etoile-du-sahel': {
        en: 'Etoile Du Sahel',
        fr: 'Étoile Du Sahel',
        ar: 'النجم الساحلي'
      },
      'the-beautiful-game': {
        en: 'The Beautiful Game',
        fr: 'Le Beau Jeu',
        ar: 'اللعبة الجميلة'
      },
      'all-sports-hub': {
        en: 'All-Sports Hub',
        fr: 'Centre Omnisports',
        ar: 'مركز كل الرياضات'
      }
    };
    return translations[category]?.[i18n.language] || category;
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'etoile-du-sahel':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
      case 'the-beautiful-game':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
      case 'all-sports-hub':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const handleResultClick = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Search articles...')}
              className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('All Categories')}
            </button>
            <button
              onClick={() => setSelectedCategory('etoile-du-sahel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'etoile-du-sahel'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FiStar className="w-4 h-4" />
              {getCategoryName('etoile-du-sahel')}
            </button>
            <button
              onClick={() => setSelectedCategory('the-beautiful-game')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'the-beautiful-game'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>⚽</span>
              {getCategoryName('the-beautiful-game')}
            </button>
            <button
              onClick={() => setSelectedCategory('all-sports-hub')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all-sports-hub'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <GiBoxingGlove className="w-4 h-4" />
              {getCategoryName('all-sports-hub')}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">{t('Searching...')}</span>
            </div>
          )}

          {error && (
            <div className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && query.trim().length >= 2 && results.length === 0 && (
            <div className="p-6 text-center">
              <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">{t('No articles found for')} "{query}"</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('Try different keywords or browse categories')}</p>
            </div>
          )}

          {query.trim().length < 2 && !loading && (
            <div className="p-6 text-center">
              <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">{t('Start typing to search articles...')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('Search in titles, content, and tags')}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((article) => {
                const content = getLocalizedArticleContent(article, i18n.language);
                return (
                  <Link
                    key={article._id}
                    to={`/article/${article.slug || article._id}`}
                    onClick={handleResultClick}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex gap-4">
                      {/* Article Image */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={article.image || 'https://via.placeholder.com/64x64/cccccc/666666?text=No+Image'}
                          alt={content?.title || 'Article'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64/cccccc/666666?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Article Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {content?.title || 'Untitled'}
                          </h3>
                          <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getCategoryStyle(article.category)}`}>
                            {getCategoryIcon(article.category)}
                            <span>{getCategoryName(article.category)}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{article.date}</span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {content?.excerpt || 'No description available'}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <FiHeart className="w-3 h-3" />
                            <span>{article.likes?.count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMessageCircle className="w-3 h-3" />
                            <span>{article.comments || 0}</span>
                          </div>
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>#{article.tags[0]}</span>
                              {article.tags.length > 1 && (
                                <span className="text-gray-400">+{article.tags.length - 1}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 