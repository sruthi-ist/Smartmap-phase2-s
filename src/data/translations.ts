import type { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Header & Navigation
    'app.title': 'GeoVision',
    'app.tagline': 'DGE Abu Dhabi Intelligent GIS Platform',
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.help': 'Help',
    'nav.exploreMap': 'Explore Map',
    'nav.signIn': 'Sign In',
    'nav.guest': 'Guest User',
    'nav.profile': 'Profile',
    'nav.favorites': 'My Favorites',
    'nav.history': 'Conversation History',
    'nav.feedback': 'Feedback',
    'nav.logout': 'Sign Out',
    'nav.language': 'العربية',
    'nav.themeLight': 'Light Mode',
    'nav.themeDark': 'Dark Mode',

    // Hero Section
    'hero.title': 'Discover Abu Dhabi through intelligent maps',
    'hero.subtitle': 'Ask questions naturally, explore trusted geospatial information, and uncover location-based insights with GeoVision.',
    'hero.searchPlaceholder': 'Ask GeoVision anything about Abu Dhabi...',
    'hero.suggestedLabel': 'Suggested spatial prompts:',
    'prompt.hospitalsKhalifa': 'Show hospitals within 5 km of Khalifa City',
    'prompt.schoolsYas': 'Find schools within 3 km of Yas Island',
    'prompt.parksAbuDhabi': 'Show public parks in Abu Dhabi',
    'prompt.govReem': 'What government facilities are near Al Reem Island?',
    'prompt.healthcareCompare': 'Compare healthcare facilities in two areas',

    // Voice Search Overlay
    'voice.title': 'Listening to your request...',
    'voice.listeningHint': 'Speak naturally about any location, service, or GIS layer in Abu Dhabi',
    'voice.capturedLabel': 'Voice Captured:',
    'voice.btnEdit': 'Edit Text',
    'voice.btnSearch': 'Search with GeoVision',
    'voice.btnCancel': 'Cancel',

    // Categories
    'categories.quickTitle': 'Quick Spatial Categories',
    'categories.viewAll': 'View all categories →',
    'categories.explorerTitle': 'Category Explorer Catalog',
    'categories.searchPlaceholder': 'Search categories or datasets...',
    'categories.selectAll': 'Select All',
    'categories.clearSelection': 'Clear Selection',
    'categories.applyToMap': 'Apply to Map',
    'categories.datasetsSelected': 'datasets selected',

    // Map Workspace
    'map.searchModeAI': 'Ask GeoVision AI',
    'map.searchModeLoc': 'Find Location',
    'map.locPlaceholder': 'Search Abu Dhabi location, district, or landmark...',
    'map.authoritativeBadge': 'SDI Open Data',
    'map.externalBadge': 'External Information — Not Authenticated',

    // Map Tools
    'tool.identify': 'Identify Feature',
    'tool.basemap': 'Basemap Gallery',
    'tool.legend': 'Map Legend',
    'tool.buffer': 'Buffer Analysis',
    'tool.print': 'Print / Export Map',
    'tool.sketch': 'Sketch AOI & Smart Insights',
    'tool.coordinates': 'Coordinates',
    'tool.locateMe': 'Locate Me',
    'tool.resetExtents': 'Default Extent',

    // Identify Tool
    'identify.title': 'Feature Inspector',
    'identify.askAI': 'Ask GeoVision about this feature',
    'identify.saveFav': 'Save to Favorites',
    'identify.category': 'Category',
    'identify.address': 'Address',
    'identify.status': 'Status',
    'identify.phone': 'Phone',

    // Basemaps
    'basemap.streets': 'Streets',
    'basemap.light': 'Light Canvas',
    'basemap.satellite': 'Satellite',

    // Buffer Analysis
    'buffer.title': 'Guided Buffer Spatial Analysis',
    'buffer.step1': '1. Select Target',
    'buffer.step2': '2. Distance Radius',
    'buffer.step3': '3. Apply & Analyze',
    'buffer.km': 'km',
    'buffer.meters': 'meters',
    'buffer.apply': 'Apply Buffer Ring',
    'buffer.resultsFound': 'features found within radius',
    'buffer.clear': 'Clear Buffer',

    // Print Export
    'print.title': 'Print / Export DGE Map Report',
    'print.subtitle': 'Generate government-compliant printable spatial reports.',
    'print.layoutView': 'Current Map View',
    'print.formatPDF': 'PDF Document',
    'print.formatPNG': 'PNG Image',
    'print.formatJPEG': 'JPEG Image',
    'print.btnGenerate': 'Generate Printable Map',
    'print.generating': 'Preparing map report...',
    'print.ready': 'Map ready for download',
    'print.download': 'Download Report',

    // Sketch AOI & Smart Insights
    'sketch.title': 'Sketch Area of Interest (AOI)',
    'sketch.drawFreehand': 'Freehand',
    'sketch.drawPolygon': 'Polygon',
    'sketch.drawRect': 'Rectangle',
    'sketch.hint': 'Click points on the map to draw. Double-click to complete polygon.',
    'sketch.btnAnalyze': 'Analyze with GeoVision',
    'sketch.btnClear': 'Clear AOI',
    'aoi.summaryTitle': 'GeoVision Smart Insights Summary',
    'aoi.totalArea': 'Total Area Selected:',
    'aoi.breakdownTitle': 'Facilities Breakdown:',

    // GeoVision AI Assistant
    'ai.panelTitle': 'GeoVision AI Assistant',
    'ai.newChat': 'New Conversation',
    'ai.understanding': 'Understanding request...',
    'ai.querying': 'Querying spatial data...',
    'ai.updatingMap': 'Updating map layers...',
    'ai.inputPlaceholder': 'Ask question...',
    'ai.recommendationsTitle': 'You may also want to explore:',
    'ai.interpretationLine': 'GeoVision understood:',

    // Smart Filters
    'filters.title': 'Smart Spatial Filters',
    'filters.activeFilters': 'Active Filters:',
    'filters.clearAll': 'Clear All Filters',
    'filters.locationLabel': 'Location:',
    'filters.distanceLabel': 'Distance Radius:',
    'filters.openNow': 'Open Now Only',
    'filters.ratingLabel': 'Minimum Rating:',

    // Auth & Profile
    'auth.loginTitle': 'Sign In to GeoVision',
    'auth.signUpTitle': 'Create GeoVision Account',
    'auth.forgotTitle': 'Reset Password',
    'auth.emailLabel': 'Email / Username',
    'auth.passwordLabel': 'Password',
    'auth.confirmPassLabel': 'Confirm Password',
    'auth.btnSignIn': 'Sign In',
    'auth.btnSignUp': 'Create Account',
    'auth.btnGuest': 'Continue as Guest',
    'auth.guestPromptTitle': 'Sign In to Access Saved Features',
    'auth.guestPromptDesc': 'Sign in to save your favorite map locations, custom datasets, and conversation history across sessions.',
    'auth.guestContinue': 'Continue as Guest',
    'auth.forgotSuccess': 'Password reset link sent to your registered email.',

    // Favorites & History
    'fav.title': 'My Favorites',
    'fav.tabLocations': 'Locations',
    'fav.tabDatasets': 'Datasets',
    'fav.tabSearches': 'Saved Searches',
    'fav.empty': 'No saved items yet. Click the star icon on any map feature or location to save it.',
    'history.title': 'Conversation History',
    'history.empty': 'No conversation history found. Start chatting with GeoVision AI to save sessions.',

    // Feedback
    'feedback.title': 'Submit Feedback',
    'feedback.ratingLabel': 'Rate your experience:',
    'feedback.nameLabel': 'Your Name',
    'feedback.emailLabel': 'Email Address',
    'feedback.commentsLabel': 'Your Feedback / Suggestions',
    'feedback.btnSubmit': 'Submit Feedback',
    'feedback.success': 'Thank you! Your feedback has been submitted to the GeoVision product team.',

    // About & Help
    'about.title': 'About DGE GeoVision',
    'about.body': 'GeoVision is Abu Dhabi’s premier AI-enabled spatial intelligence platform, developed for the Department of Government Enablement (DGE). It bridges ordinary citizens, urban planners, and GIS specialists through natural language geospatial AI.',
    'help.title': 'GeoVision Help & Support Center',
    'help.searchPlaceholder': 'Search help topics and tutorials...',
    'help.faq1Q': 'How do I search for spatial data using natural language?',
    'help.faq1A': 'Simply type your question in plain English or Arabic into the search bar, such as "Show hospitals within 5 km of Khalifa City". GeoVision AI will automatically interpret your query, zoom the map, apply distance filters, and highlight matching facilities.',
    'help.faq2Q': 'What is the Sketch Area of Interest (AOI) tool?',
    'help.faq2A': 'The Sketch AOI tool lets you draw a custom region on the interactive map. Once drawn, click "Analyze with GeoVision" to get an instant AI-powered spatial insight breakdown showing all facilities, density, and recommendations for that area.',

    // Toasts
    'toast.copied': 'Coordinates copied to clipboard!',
    'toast.favSaved': 'Saved to My Favorites',
    'toast.favRemoved': 'Removed from Favorites',
    'toast.filterApplied': 'Smart Filters updated',
    'toast.signedIn': 'Signed in successfully as Registered User',
    'toast.signedOut': 'Signed out. You are now in Guest Mode.',
  },
  ar: {
    // Header & Navigation
    'app.title': 'GeoVision',
    'app.tagline': 'منصة أبوظبي الذكية للمعلومات الجغرافية - تمكين',
    'nav.home': 'الرئيسية',
    'nav.about': 'عن المنصة',
    'nav.help': 'المساعدة',
    'nav.exploreMap': 'استكشاف الخريطة',
    'nav.signIn': 'تسجيل الدخول',
    'nav.guest': 'زائر',
    'nav.profile': 'الملف الشخصي',
    'nav.favorites': 'المفضلة',
    'nav.history': 'سجل المحادثات',
    'nav.feedback': 'الملاحظات والآراء',
    'nav.logout': 'تسجيل الخروج',
    'nav.language': 'English',
    'nav.themeLight': 'الوضع الفاتح',
    'nav.themeDark': 'الوضع الداكن',

    // Hero Section
    'hero.title': 'استكشف أبوظبي عبر الخرائط الذكية',
    'hero.subtitle': 'اسأل طبيعياً، واستكشف المعلومات المكانية الموثوقة، وتعرف على التحليلات الجغرافية مع GeoVision.',
    'hero.searchPlaceholder': 'اسأل GeoVision عن أي موقع أو خدمة في أبوظبي...',
    'hero.suggestedLabel': 'الأسئلة المكانية المقترحة:',
    'prompt.hospitalsKhalifa': 'عرض المستشفيات على بعد 5 كم من مدينة خليفة',
    'prompt.schoolsYas': 'البحث عن المدارس ضمن 3 كم من جزيرة ياس',
    'prompt.parksAbuDhabi': 'عرض الحدائق العامة في أبوظبي',
    'prompt.govReem': 'ما هي المنشآت الحكومية القريبة من جزيرة الريم؟',
    'prompt.healthcareCompare': 'مقارنة الخدمات الصحية بين منطقتين',

    // Voice Search Overlay
    'voice.title': 'جاري الاستماع لطلبك...',
    'voice.listeningHint': 'تحدث بوضوح عن أي موقع، خدمة، أو طبقة جغرافية في أبوظبي',
    'voice.capturedLabel': 'النص الملتقط:',
    'voice.btnEdit': 'تعديل النص',
    'voice.btnSearch': 'البحث بواسطة GeoVision',
    'voice.btnCancel': 'إلغاء',

    // Categories
    'categories.quickTitle': 'الفئات المكانية السريعة',
    'categories.viewAll': 'عرض جميع الفئات ←',
    'categories.explorerTitle': 'مستكشف الفئات والبيانات',
    'categories.searchPlaceholder': 'البحث في الفئات والطبقات...',
    'categories.selectAll': 'تحديد الكل',
    'categories.clearSelection': 'إلغاء التحديد',
    'categories.applyToMap': 'تطبيق على الخريطة',
    'categories.datasetsSelected': 'مجموعات بيانات محددة',

    // Map Workspace
    'map.searchModeAI': 'سؤال GeoVision AI',
    'map.searchModeLoc': 'البحث عن موقع',
    'map.locPlaceholder': 'ابحث عن منطقة، حي، أو معلم في أبوظبي...',
    'map.authoritativeBadge': 'بيانات SDI المفتوحة',
    'map.externalBadge': 'معلومات خارجية — غير موثقة',

    // Map Tools
    'tool.identify': 'التعرف على المعالم',
    'tool.basemap': 'معرض الخرائط الأساسية',
    'tool.legend': 'مفتاح الخريطة',
    'tool.buffer': 'تحليل النطاق الجغرافي (Buffer)',
    'tool.print': 'طباعة وتصدير الخريطة',
    'tool.sketch': 'رسم المنطقة والتحليل الذكي',
    'tool.coordinates': 'الإحداثيات',
    'tool.locateMe': 'موقعي الحالي',
    'tool.resetExtents': 'النطاق الافتراضي',

    // Identify Tool
    'identify.title': 'مستكشف تفاصيل المعلم',
    'identify.askAI': 'اسأل GeoVision عن هذا المعلم',
    'identify.saveFav': 'حفظ في المفضلة',
    'identify.category': 'الفئة',
    'identify.address': 'العنوان',
    'identify.status': 'حالة العمل',
    'identify.phone': 'الهاتف',

    // Basemaps
    'basemap.streets': 'خريطة الشوارع',
    'basemap.light': 'الخلفية الفاتحة',
    'basemap.satellite': 'الصور الفضائية',

    // Buffer Analysis
    'buffer.title': 'تحليل النطاق الجغرافي الموجه',
    'buffer.step1': '1. تحديد الهدف',
    'buffer.step2': '2. مسافة الشعاع',
    'buffer.step3': '3. تطبيق وتحليل',
    'buffer.km': 'كم',
    'buffer.meters': 'متر',
    'buffer.apply': 'تطبيق نطاق المسافة',
    'buffer.resultsFound': 'معلماً ضمن هذا النطاق',
    'buffer.clear': 'إلغاء النطاق',

    // Print Export
    'print.title': 'طباعة وتصدير تقرير الخريطة',
    'print.subtitle': 'إنشاء تقارير مكانية مطابقة للمواصفات الحكومية.',
    'print.layoutView': 'عرض الخريطة الحالية',
    'print.formatPDF': 'مستند PDF',
    'print.formatPNG': 'صورة PNG',
    'print.formatJPEG': 'صورة JPEG',
    'print.btnGenerate': 'إنشاء الخريطة المطبوعة',
    'print.generating': 'جاري تجهيز تقرير الخريطة...',
    'print.ready': 'الخريطة جاهزة للتنزيل',
    'print.download': 'تحميل التقرير',

    // Sketch AOI & Smart Insights
    'sketch.title': 'رسم منطقة الاهتمام (AOI)',
    'sketch.drawFreehand': 'رسم حر',
    'sketch.drawPolygon': 'مضلع',
    'sketch.drawRect': 'مستطيل',
    'sketch.hint': 'انقر على النقاط لتحديد المنطقة. انقر مرتين لإكمال الشكل.',
    'sketch.btnAnalyze': 'التحليل بواسطة GeoVision',
    'sketch.btnClear': 'مسح المنطقة',
    'aoi.summaryTitle': 'ملخص التحليل الذكي من GeoVision',
    'aoi.totalArea': 'إجمالي المساحة المحددة:',
    'aoi.breakdownTitle': 'توزيع المنشآت والخدمات:',

    // GeoVision AI Assistant
    'ai.panelTitle': 'مساعد GeoVision الذكي',
    'ai.newChat': 'محادثة جديدة',
    'ai.understanding': 'فهم طلبك المكانية...',
    'ai.querying': 'استعلام البيانات الجغرافية...',
    'ai.updatingMap': 'تحديث طبقات الخريطة...',
    'ai.inputPlaceholder': 'اسأل سؤالاً...',
    'ai.recommendationsTitle': 'قد ترغب أيضاً في استكشاف:',
    'ai.interpretationLine': 'فهم GeoVision الطلب كالتالي:',

    // Smart Filters
    'filters.title': 'التصفية المكانية الذكية',
    'filters.activeFilters': 'الفلاتر النشطة:',
    'filters.clearAll': 'مسح جميع الفلاتر',
    'filters.locationLabel': 'الموقع:',
    'filters.distanceLabel': 'شعاع المسافة:',
    'filters.openNow': 'المفتوحة حالياً فقط',
    'filters.ratingLabel': 'التقييم الأدنى:',

    // Auth & Profile
    'auth.loginTitle': 'تسجيل الدخول إلى GeoVision',
    'auth.signUpTitle': 'إنشاء حساب جديد',
    'auth.forgotTitle': 'استعادة كلمة المرور',
    'auth.emailLabel': 'البريد الإلكتروني / اسم المستخدم',
    'auth.passwordLabel': 'كلمة المرور',
    'auth.confirmPassLabel': 'تأكيد كلمة المرور',
    'auth.btnSignIn': 'تسجيل الدخول',
    'auth.btnSignUp': 'إنشاء حساب',
    'auth.btnGuest': 'المتابعة كزائر',
    'auth.guestPromptTitle': 'سجل الدخول للوصول للميزات المحفوظة',
    'auth.guestPromptDesc': 'سجل الدخول لحفظ المواقع المفضلة، الطبقات الجغرافية، وسجل المحادثات عبر جلسات الاستخدام.',
    'auth.guestContinue': 'المتابعة كزائر',
    'auth.forgotSuccess': 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',

    // Favorites & History
    'fav.title': 'المفضلة الخاصة بي',
    'fav.tabLocations': 'المواقع',
    'fav.tabDatasets': 'مجموعات البيانات',
    'fav.tabSearches': 'عمليات البحث المحفوظة',
    'fav.empty': 'لا توجد عناصر محفوظة حتى الآن. انقر على أيقونة النجمة على أي معلم للحفظ.',
    'history.title': 'سجل المحادثات',
    'history.empty': 'لا يوجد سجل محادثات سابق. ابدأ التحدث مع GeoVision لحفظ الجلسات.',

    // Feedback
    'feedback.title': 'إرسال الملاحظات والآراء',
    'feedback.ratingLabel': 'تقييم تجربتك:',
    'feedback.nameLabel': 'الاسم الكامل',
    'feedback.emailLabel': 'البريد الإلكتروني',
    'feedback.commentsLabel': 'ملاحظاتك واقتراحاتك',
    'feedback.btnSubmit': 'إرسال الملاحظات',
    'feedback.success': 'شكراً لك! تم إرسال ملاحظاتك إلى فريق عمل منصة GeoVision.',

    // About & Help
    'about.title': 'عن منصة GeoVision - تمكين',
    'about.body': 'منصة GeoVision هي المنصة الذكية الرائدة للمعلومات الجغرافية والمكانية في إمارة أبوظبي، طُورت لصالح دائرة تمكين الحكومي (DGE). تدمج المنصة الذكاء الاصطناعي التفاعلي مع نظم المعلومات الجغرافية لتقديم تجربة استكشاف مكانية سلسة.',
    'help.title': 'مركز المساعدة والدعم الفني',
    'help.searchPlaceholder': 'البحث في مواضيع المساعدة والإرشادات...',
    'help.faq1Q': 'كيف يمكنني البحث عن البيانات الجغرافية باللغة الطبيعية؟',
    'help.faq1A': 'ببساطة اكتب سؤالك باللغة العربية أو الإنجليزية في شريط البحث، مثل "عرض المستشفيات على بعد 5 كم من مدينة خليفة". سيقوم مساعد GeoVision بفهم طلبك تلقائياً، وتحديد الموقع، وتطبيق فلاتر المسافة، وإظهار المعالم.',
    'help.faq2Q': 'ما هي أداة رسم منطقة الاهتمام (AOI)؟',
    'help.faq2A': 'تتيح لك أداة رسم منطقة الاهتمام تحديد منطقة مخصصة على الخريطة التفاعلية. بعد الرسم، انقر على "التحليل بواسطة GeoVision" للحصول على ملخص إحصائي وتحليلي فوري لجميع الخدمات والمنشآت.',

    // Toasts
    'toast.copied': 'تم نسخ الإحداثيات إلى الحافظة!',
    'toast.favSaved': 'تم الحفظ في المفضلة',
    'toast.favRemoved': 'تمت الإزالة من المفضلة',
    'toast.filterApplied': 'تم تحديث الفلاتر الذكية',
    'toast.signedIn': 'تم تسجيل الدخول بنجاح كمستخدم مسجل',
    'toast.signedOut': 'تم تسجيل الخروج. أنت الآن في وضع الزائر.',
  },
};
