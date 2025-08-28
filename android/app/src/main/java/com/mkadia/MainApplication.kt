package com.mkadia

import android.app.Application
import android.content.Context
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

// Flipper imports - only needed in debug builds
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.android.utils.FlipperUtils
import com.facebook.flipper.core.FlipperClient
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin
// import com.facebook.flipper.plugins.fresco.FrescoFlipperPlugin // Commented out - Fresco not used
import com.facebook.flipper.plugins.inspector.DescriptorMapping
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin
import com.facebook.flipper.plugins.react.ReactFlipperPlugin
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin
import com.facebook.react.modules.network.NetworkingModule
import okhttp3.OkHttpClient

class MainApplication : Application(), ReactApplication {

    // React Native Host configuration
    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            // Get list of React Native packages (auto-linked + manual)
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here
                    // Example: add(MyReactNativePackage())
                }

            // Main JS bundle entry point
            override fun getJSMainModuleName(): String = "index"

            // Enable developer support (dev menu, reload, etc.) in debug builds
            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            // Enable New Architecture (Fabric/TurboModules) if configured
            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            
            // Enable Hermes JS engine if configured
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    // React Host for New Architecture support
    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        
        // Load React Native
        loadReactNative(this)
        
        // Initialize SoLoader for loading native libraries
        SoLoader.init(this, false)
        
        // Initialize Flipper only in debug builds
        if (BuildConfig.DEBUG) {
            initializeFlipper(this, reactNativeHost.reactInstanceManager)
        }
    }

    /**
     * Initialize Flipper debugging tools
     * This method sets up various Flipper plugins for debugging:
     * - Layout Inspector: Inspect view hierarchy
     * - React DevTools: Debug React components
     * - Network Inspector: Monitor network requests
     * - Database Inspector: View SQLite databases
     * - Shared Preferences: View app preferences
     * - Crash Reporter: Track app crashes
     * - Console Logs: View all console.log messages with filtering
     */
    private fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
        // Only initialize if Flipper should be enabled (debug builds + proper setup)
        if (FlipperUtils.shouldEnableFlipper(this)) {
            // Get Flipper client instance
            val client: FlipperClient = AndroidFlipperClient.getInstance(context)
            
            // Layout Inspector Plugin - Inspect view hierarchy and properties
            client.addPlugin(InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()))
            
            // React Plugin - Debug React components, props, and state
            client.addPlugin(ReactFlipperPlugin())
            
            // Database Plugin - Inspect SQLite databases
            client.addPlugin(DatabasesFlipperPlugin(context))
            
            // SharedPreferences Plugin - View and edit shared preferences
            client.addPlugin(SharedPreferencesFlipperPlugin(context))
            
            // Crash Reporter Plugin - Track and analyze crashes
            client.addPlugin(CrashReporterPlugin.getInstance())
            
            // All console.log, console.warn, console.error messages will automatically
            // appear in Flipper's "Logs" plugin with filtering and search capabilities
            
            // Network Plugin - Monitor HTTP requests and responses
            val networkFlipperPlugin = NetworkFlipperPlugin()
            
            // Set up network interceptor for React Native's networking module
            NetworkingModule.setCustomClientBuilder { builder: OkHttpClient.Builder ->
                builder.addNetworkInterceptor(FlipperOkhttpInterceptor(networkFlipperPlugin))
            }
            client.addPlugin(networkFlipperPlugin)
                        
            // Start the Flipper client
            client.start()
            
            // Test console logs - these will appear in Flipper's Logs plugin
            println("✅ Flipper initialized successfully!")
            println("🔧 Available plugins: Inspector, React, Database, SharedPrefs, Network, Crash Reporter")
        }
    }
}