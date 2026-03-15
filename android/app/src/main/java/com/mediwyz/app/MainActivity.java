package com.mediwyz.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
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

        // Request runtime permissions upfront so WebRTC can access camera/mic
        requestRequiredPermissions();
    }

    @Override
    public void onStart() {
        super.onStart();

        WebView webView = getBridge().getWebView();

        // Get the existing WebChromeClient set by Capacitor's bridge
        // and wrap it to add WebRTC permission granting
        final WebChromeClient originalClient = getOriginalChromeClient(webView);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Auto-grant WebRTC permissions (camera, microphone) in the WebView
                // Android runtime permissions are requested separately in onCreate
                runOnUiThread(() -> request.grant(request.getResources()));
            }

            // Delegate all other calls to original client if available
            @Override
            public void onPermissionRequestCanceled(PermissionRequest request) {
                if (originalClient != null) {
                    originalClient.onPermissionRequestCanceled(request);
                } else {
                    super.onPermissionRequestCanceled(request);
                }
            }
        });

        // Enable file upload input (for food scan photo)
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);

        // Enable JavaScript and DOM storage
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);

        // Enable media playback without user gesture (for video calls)
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
    }

    private WebChromeClient getOriginalChromeClient(WebView webView) {
        try {
            return webView.getWebChromeClient();
        } catch (Exception e) {
            return null;
        }
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
        // Permissions are now granted (or denied) — WebRTC will work if granted
    }
}
