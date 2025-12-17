# Google Play Store Submission Guide

## 1. Your Release Build is Ready
**File Location:** [`android/app/build/outputs/bundle/release/app-release.aab`](file:///Users/rahulreddy/Desktop/Rahul/work/Dumbbells/android/app/build/outputs/bundle/release/app-release.aab)
**Type:** Android App Bundle (`.aab`)

> [!IMPORTANT]
> Save your `my-upload-key.keystore` and `gradle.properties` (with passwords) in a secure place (like Google Drive or 1Password). **If you lose these, you can NEVER update this app again on the Play Store.**

## 2. Google Play Console Setup
1.  Go to [Google Play Console](https://play.google.com/console).
2.  Register for a developer account (One-time $25 fee).
3.  Verify your ID (this can take up to 48 hours).

## 3. Create Key Store Listing Assets
You need to prepare these design assets before starting:
-   **App Icon**: 512 x 512 px PNG (32-bit).
-   **Feature Graphic**: 1024 x 500 px PNG or JPEG.
-   **Phone Screenshots**: At least 2 screenshots (16:9 or 9:16 aspect ratio recommended).
-   **Short Description**: Max 80 characters (e.g., "Track your dumbbell workouts effectively").
-   **Full Description**: Max 4000 characters (Detail your features).

## 4. Create the App in Console
1.  Click **"Create app"** in the top right.
2.  **App Name**: Enter "Dumbbells" (or your chosen public name).
3.  **Default Language**: English (United States).
4.  **App or Game**: App.
5.  **Free or Paid**: Free.
6.  Agree to the Developer Program Policies and US Export Laws.
7.  Click **Create app**.

## 5. App Content Setup (Dashboard)
You will see a checklist on the Dashboard. You must complete these in order:
1.  **Privacy Policy**: Enter your hosted privacy policy URL. (Use a free generator/host like GitHub Pages or sites like Privacypolicygenerator.info if needed).
2.  **App Access**:
    -   If your app requires login: Provide a test username/password.
    -   If no login: Select "All functionality is available without special access".
3.  **Ads**: Select "No, my app does not contain ads" (unless you added AdMob).
4.  **Content Rating**: Fill out the questionnaire (frequency of violence, language, etc.).
5.  **Target Audience**: Select "18+" to avoid complex family policies, unless specifically targeting kids.
6.  **News Apps**: Select "No".
7.  **COVID-19 Tracing**: Select "My app is not a publicly available COVID-19 contact tracing or status app".
8.  **Data Safety**: This is critical. Based on your libraries (`react-native-firebase`, etc.):
    -   **Firebase Analytics**: Disclose "Collection" of "Device or other IDs", "Approximate Location", "App Interactions".
    -   **Crashlytics**: Disclose "Crash logs".
    -   Mark valid purposes like "Analytics" and "App functionality".
9.  **Government Apps**: Select "No".

## 6. Store Listing
1.  Go to **Main store listing** in the side menu.
2.  Upload your Icon, Feature Graphic, and Screenshots.
3.  Enter your Short and Full descriptions.
4.  Save.

## 7. Upload & Release
1.  In the side menu, go to **Release > Production**. (Or **Testing > Internal testing** if you want to test with a small group first).
2.  Click **Create new release**.
3.  **App bundles**: Click **Upload** and select your `app-release.aab` file.
4.  **Release Name**: It will auto-fill (e.g., "1.0.0").
5.  **Release Notes**: Enter "Initial Release".
6.  Click **Next**.
7.  You might see warnings (yellow). Errors (red) must be fixed.
    -   *Note: If you see a warning about "Obfuscation", you can ignore it for now, or upload the `mapping.txt` file found in `android/app/build/outputs/mapping/release/mapping.txt`.*
8.  Click **Save** and then **Go to publishing overview**.
9.  Submit your changes for review!

> [!NOTE]
> Review times can vary from 1 day to 7 days for new accounts.
