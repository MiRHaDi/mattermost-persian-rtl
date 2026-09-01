# ممیزی upstream و پروژه‌های موجود

تاریخ ممیزی: ۱ سپتامبر ۲۰۲۶، منطقه‌ی زمانی تهران

## مخزن‌ها

| پروژه | شاخه و commit ممیزی‌شده | آخرین Release مشاهده‌شده | نتیجه‌ی بررسی مجوز |
|---|---|---|---|
| Mattermost | `master` / `679dcd7e1653320dbffa0a9a664f196f406362e3` | `v11.10.1` در ۲۴ اوت ۲۰۲۶ | شرایط مخزن upstream برقرار است؛ هیچ کد upstream در این پروژه بازتوزیع نشده است. |
| Mattermost Desktop | `master` / `9e6b8b65a9bb80f190c78a4aa8803f0067f95fd9` | `v6.3.0` در ۱۳ اوت ۲۰۲۶ | شرایط مخزن upstream برقرار است؛ هیچ کد upstream در این پروژه بازتوزیع نشده است. |
| قالب رسمی افزونه | `master` / `3296cf6fad808c2372c254cf7b64bcc8a2144e67` | `v0.5.0` در ۲۰ مارس ۲۰۲۵ | Apache-2.0 |
| افزونه‌ی RTL کوئرا | `main` / `e64afd75f43a6fa660e046b7859863047b0700f3` | `v1.0.4` در ۲۹ مارس ۲۰۲۵ | فایل `LICENSE`، `COPYING` یا `NOTICE` ندارد و مقدار `license` در `webapp/package.json` خالی است. |

سرشاخه‌ها با Git و اطلاعات Release با API مخزن‌های GitHub کنترل شدند. چون مخزن
QueraTeam مجوز صریح ندارد، پیاده‌سازی آن در این پروژه به‌کار نرفته است. فقط رفتار
عمومی و شکاف‌های سازگاری آن برای تعریف آزمون‌های یک پیاده‌سازی مستقل بررسی شد.

## وضعیت فعلی هسته

در commit ممیزی‌شده‌ی Mattermost:

- فارسی با عنوان `فارسی (Alpha)` در `webapp/channels/src/i18n/i18n.ts` ثبت شده
  است.
- کاتالوگ‌های فارسی در `webapp/channels/src/i18n/fa.json` و
  `server/i18n/fa.json` وجود دارند.
- مخزن عمومی Mattermost Desktop نیز `i18n/fa.json` دارد و `fa` را با عنوان
  Farsi ثبت کرده است.
- ریشه‌ی پیام رندرشده هم‌اکنون کلاس `post-message__text` و مقدار `dir='auto'`
  دارد.
- ویرایشگر غنی `role='textbox'` دارد و شناسه‌های شناخته‌شده‌ی ویرایشگر متنی،
  مانند `post_textbox` و `reply_textbox`، به آن داده می‌شوند.
- issue شماره‌ی `mattermost/mattermost#27911` همچنان باز است و اشکال متن دوجهته
  در پیام‌های شروع‌شده با mention را ثبت می‌کند؛ حالتی که `dir='auto'` به‌تنهایی
  حل نمی‌کند.

برچسب `Alpha` و روند رسمی توسعه دو محدودیت مهم‌اند. مستندات Mattermost می‌گوید
در حالت معمول فقط `en.json` باید مستقیم ویرایش شود و فایل زبان‌های دیگر از
Weblate به‌روز می‌شوند. صفحه‌ی آمار زنده‌ی Weblate هنگام ممیزی پشت چالش تعاملی
ضدبات بود؛ بنابراین این پروژه درصد تکمیل تأییدنشده منتشر نمی‌کند.

## تصمیم معماری افزونه

طبق مستندات رسمی، bundle افزونه‌ی وب توسط کلاینت وب و دسکتاپ دریافت می‌شود، با
`window.registerPlugin` ثبت می‌شود و در زمان initialize یک registry می‌گیرد.
`registerRootComponent` محل رسمی و منعطف برای رفتار مرورگری سراسری است و سایر
slotها برای توسعه‌ی اجزای پشتیبانی‌شده طراحی شده‌اند.

در registry مستندشده تابعی برای تغییر جهت ریشه یا آینه‌ای‌کردن تمام اجزای موجود
هسته وجود ندارد. در نتیجه RTL کامل کل رابط از داخل افزونه‌ی ثالث به overrideهای
گسترده و وابسته به نسخه‌ی DOM/CSS نیاز دارد. این پروژه از Root Component رسمی
استفاده می‌کند، اما کنترل‌گر سازگاری DOM را آگاهانه به بخش‌های متنی پیام و
ویرایشگر محدود کرده است.

## مسیر درست مشارکت

- این کد مستقل باید در مخزن افزونه‌ی جامعه منتشر شود و پس از آزمون زنده روی چند
  نسخه و انتشار Releaseهای قابل نگه‌داری، برای فهرست افزونه‌های جامعه پیشنهاد
  شود.
- اصلاح متن‌های فارسی محصول باید در Weblate رسمی Mattermost انجام شود؛ نه در
  این افزونه و در حالت معمول نه با ویرایش مستقیم `fa.json` هسته.
- بهبودهای عمومی و پایدار چیدمان RTL باید به‌صورت تغییرهای کوچک در
  `mattermost/mattermost`، متصل به issue و همراه آزمون هسته پیشنهاد شوند. این
  افزونه‌ی مستقل جایگزین صادقانه‌ی چنین PR بالادستی نیست.

## منابع اصلی

- <https://github.com/mattermost/mattermost>
- <https://github.com/mattermost/mattermost/releases/tag/v11.10.1>
- <https://github.com/mattermost/desktop>
- <https://github.com/mattermost/desktop/releases/tag/v6.3.0>
- <https://developers.mattermost.com/integrate/reference/webapp/webapp-reference/>
- <https://developers.mattermost.com/integrate/plugins/components/webapp/>
- <https://developers.mattermost.com/contribute/more-info/webapp/developer-workflow/>
- <https://github.com/mattermost/mattermost/issues/27911>
- <https://github.com/mattermost/mattermost-plugin-starter-template>
- <https://github.com/QueraTeam/mattermost-rtl>
