# 🧪 Testing Guide: Image Loading & French Language Fixes

## 🔍 Overview
This guide helps you verify that the two major issues have been resolved:
1. **Image loading/disappearing problems**
2. **French language content not displaying properly**

---

## 🖼️ **Issue 1: Image Loading Tests**

### **A. Main Article Images**
1. **Visit any article page** and check:
   - [ ] Main hero image loads properly
   - [ ] Image displays correctly on first load
   - [ ] Image persists after page refresh
   - [ ] Image maintains quality and proper dimensions

2. **Check browser console** (F12 → Console):
   - [ ] No 404 errors for images
   - [ ] Image URL construction logs should show proper full URLs
   - [ ] Any errors should show fallback placeholder images

### **B. Image Groups in Articles**
1. **Find articles with image groups** and verify:
   - [ ] All images in groups load correctly
   - [ ] Images display with proper spacing and sizing
   - [ ] Captions appear correctly in all languages
   - [ ] No broken image placeholders

### **C. Article Editor Image Loading**
1. **Go to Admin → Edit any article** and check:
   - [ ] Main article image loads in preview
   - [ ] Image groups display properly during editing
   - [ ] Existing images show correctly (not broken)
   - [ ] New image uploads work without issues

2. **Test editing workflow**:
   - [ ] Upload new images
   - [ ] Edit existing image groups
   - [ ] Save changes
   - [ ] Verify images persist after save

### **D. Server-Side Monitoring**
Monitor your **Render logs** for:
```
✅ Expected logs:
File saved to: /opt/render/project/src/backend/uploads/[filename]
File verification successful: [filename]
Static file request: /[filename]
File exists, serving: /[filename]

❌ Problem indicators:
File not found: /[filename]
File verification failed: [filename]
Uploads directory does not exist!
Available files in uploads directory: []
```

---

## 🇫🇷 **Issue 2: French Language Tests**

### **A. Language Switching**
1. **Switch site language to French** (FR) and verify:
   - [ ] Language switcher responds correctly
   - [ ] URL updates to include language parameter
   - [ ] Site interface changes to French

2. **Check article listings**:
   - [ ] Article titles display in French
   - [ ] Article excerpts show French content
   - [ ] Category names appear in French

### **B. Individual Article View**
1. **Click on any article while in French mode**:
   - [ ] Article title displays in French
   - [ ] Article content shows French text
   - [ ] Image captions appear in French
   - [ ] Author and metadata display correctly

2. **Check browser console** for translation logs:
```javascript
✅ Expected logs:
Article Component - getCurrentLanguageContent called:
- Current language: fr
- Found fr translation: {title: "...", content: [...]}
Using fr translation for article [id]

❌ Problem indicators:
- No fr translation found, falling back to English
- Article translations: undefined
- Translation structure missing or corrupted
```

### **C. Article Editor in French Mode**
1. **Switch to French and edit an article**:
   - [ ] Editor shows French content fields
   - [ ] French title loads correctly
   - [ ] French content blocks display properly
   - [ ] Image captions show French text
   - [ ] Save functionality works for French content

2. **Test multilingual workflow**:
   - [ ] Switch between EN/FR/AR in editor
   - [ ] Content preserves correctly for each language
   - [ ] Images and captions update per language
   - [ ] No content loss when switching languages

### **D. Debug Information**
Check browser console for detailed translation debugging:
```javascript
ArticleEditor: Found translations structure: {...}
ArticleEditor: Set fr - title: "[French Title]", content blocks: [number]
ArticleEditor: Final titles: {en: "...", fr: "...", ar: "..."}
```

---

## 🚨 **Common Issues & Solutions**

### **Image Loading Issues**
- **Images not loading**: Check Render logs for file existence
- **404 errors**: Images may have been cleared by Render restart
- **Broken previews**: Browser cache issue - hard refresh (Ctrl+F5)

### **French Content Issues**
- **English content showing**: Check article has French translations
- **Empty content**: Article may need French content to be added
- **Editor issues**: Clear browser cache and reload editor

---

## 📊 **Success Criteria**

### **✅ Images Working Properly When:**
- All images load consistently across site
- No 404 errors in browser console
- Editor displays images correctly
- Image groups function in all languages
- Server logs show successful file serving

### **✅ French Language Working When:**
- Language switching updates content immediately
- French articles display full French content
- Editor loads and saves French content correctly
- Translation debugging logs show successful language detection
- No fallback to English when French content exists

---

## 🔧 **If Issues Persist**

1. **Check deployment status**:
   - Verify Render backend deployment completed
   - Confirm Vercel frontend deployment finished

2. **Clear browser cache**:
   - Hard refresh (Ctrl+F5)
   - Clear site data in browser settings

3. **Monitor server logs**:
   - Check Render logs for error messages
   - Look for image file operation logs

4. **Test in different browsers**:
   - Verify issues aren't browser-specific
   - Test incognito/private mode

---

**🎯 Both issues should now be resolved with the deployed fixes!** 