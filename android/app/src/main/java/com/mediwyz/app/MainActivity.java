package com.mediwyz.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int PERMISSION_REQUEST_CODE = 1001;

    private static final String[] REQUIRED_PERMISSIONS = {
        Manifest.permission.CAMERA,
        Manifest.permission.RECORD_AUDIO,
        Manifest.permission.MODIFY_AUDIO_SETTINGS,
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Request runtime permissions upfront so WebRTC and camera can work
        requestRequiredPermissions();
    }

    @Override
    public void onStart() {
        super.onStart();

        WebView webView = getBridge().getWebView();

        // IMPORTANT: Get the original WebChromeClient that Capacitor set up.
        // Capacitor's client handles onShowFileChooser (file uploads),
        // geolocation, console messages, etc. We must delegate to it.
        final WebChromeClient capacitorClient = webView.getWebChromeClient();

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Auto-grant WebRTC permissions (camera, microphone) in the WebView
                runOnUiThread(() -> request.grant(request.getResources()));
            }

            @Override
            public void onPermissionRequestCanceled(PermissionRequest request) {
                if (capacitorClient != null) {
                    capacitorClient.onPermissionRequestCanceled(request);
                } else {
                    super.onPermissionRequestCanceled(request);
                }
            }

            // CRITICAL: Delegate file chooser to Capacitor's handler
            // Without this, <input type="file"> and camera capture won't work
            @Override
            public boolean onShowFileChooser(
                WebView webView,
                ValueCallback<Uri[]> filePathCallback,
                FileChooserParams fileChooserParams
            ) {
                if (capacitorClient != null) {
                    return capacitorClient.onShowFileChooser(webView, filePathCallback, fileChooserParams);
                }
                return super.onShowFileChooser(webView, filePathCallback, fileChooserParams);
            }

            // Delegate JS dialogs to Capacitor
            @Override
            public boolean onJsAlert(WebView view, String url, String message, android.webkit.JsResult result) {
                if (capacitorClient != null) {
                    return capacitorClient.onJsAlert(view, url, message, result);
                }
                return super.onJsAlert(view, url, message, result);
            }

            @Override
            public boolean onJsConfirm(WebView view, String url, String message, android.webkit.JsResult result) {
                if (capacitorClient != null) {
                    return capacitorClient.onJsConfirm(view, url, message, result);
                }
                return super.onJsConfirm(view, url, message, result);
            }

            @Override
            public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, android.webkit.JsPromptResult result) {
                if (capacitorClient != null) {
                    return capacitorClient.onJsPrompt(view, url, message, defaultValue, result);
                }
                return super.onJsPrompt(view, url, message, defaultValue, result);
            }

            // Delegate console messages for debugging
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                if (capacitorClient != null) {
                    return capacitorClient.onConsoleMessage(consoleMessage);
                }
                return super.onConsoleMessage(consoleMessage);
            }

            // Delegate progress updates
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (capacitorClient != null) {
                    capacitorClient.onProgressChanged(view, newProgress);
                } else {
                    super.onProgressChanged(view, newProgress);
                }
            }

            // Delegate geolocation permissions
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, android.webkit.GeolocationPermissions.Callback callback) {
                if (capacitorClient != null) {
                    capacitorClient.onGeolocationPermissionsShowPrompt(origin, callback);
                } else {
                    super.onGeolocationPermissionsShowPrompt(origin, callback);
                }
            }
        });

        // Enable file access for uploads
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);

        // Enable JavaScript and DOM storage
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);

        // Enable media playback without user gesture (for video calls)
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
    }

    private void requestRequiredPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            boolean allGranted = true;
            for (String permission : REQUIRED_PERMISSIONS) {
                if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            if (!allGranted) {
                ActivityCompat.requestPermissions(this, REQUIRED_PERMISSIONS, PERMISSION_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
