package com.sourcecodelife.app

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.annotation.Keep
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

@Keep
class MapBridge(
    private val context: Context,
    private val webView: WebView
) {
    private val auth   = FirebaseAuth.getInstance()
    private val db     = FirebaseFirestore.getInstance()
    private val TAG    = "MapBridge"
    private val prefs  = context.getSharedPreferences("scl_location", Context.MODE_PRIVATE)
    private val fusedLocation = LocationServices.getFusedLocationProviderClient(context)

    private val http = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    companion object {
        const val PREF_PROMPT_ENABLED = "geo_prompt_enabled"
        const val PREF_GRANTED        = "geo_granted"
        const val LOCATION_PERM_REQUEST_CODE = 1001
        private const val NOMINATIM_BASE = "https://nominatim.openstreetmap.org"
        private const val USER_AGENT     = "SourceCodeLife Android App (sourcecodelife.com)"
    }

    @JavascriptInterface
    fun getMapsApiKey() {
        // Even for Leaflet, we trigger this so JS knows the bridge is ready
        js("NativeMap_onApiKey('LEAFLET_MODE')")
    }

    @JavascriptInterface
    fun checkPermissionState() {
        val state = if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
            == PackageManager.PERMISSION_GRANTED) "granted" else "not_asked"
        js("NativeLocation_onPermissionState('$state')")
    }

    @JavascriptInterface
    fun requestLocationPermission() {
        (context as? android.app.Activity)?.requestPermissions(
            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
            LOCATION_PERM_REQUEST_CODE
        )
    }

    @JavascriptInterface
    fun requestLocation() {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            js("NativeLocation_onLocationResult(false, 0, 0)")
            return
        }
        fusedLocation.lastLocation.addOnSuccessListener { lastLoc ->
            if (lastLoc != null) {
                js("NativeLocation_onLocationResult(true, ${lastLoc.latitude}, ${lastLoc.longitude})")
            } else {
                val cts = CancellationTokenSource()
                fusedLocation.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, cts.token)
                    .addOnSuccessListener { loc ->
                        if (loc != null) js("NativeLocation_onLocationResult(true, ${loc.latitude}, ${loc.longitude})")
                        else js("NativeLocation_onLocationResult(false, 0, 0)")
                    }
                    .addOnFailureListener { js("NativeLocation_onLocationResult(false, 0, 0)") }
            }
        }.addOnFailureListener { js("NativeLocation_onLocationResult(false, 0, 0)") }
    }

    @JavascriptInterface
    fun getPromptEnabled() {
        val enabled = prefs.getBoolean(PREF_PROMPT_ENABLED, true)
        js("NativeLocation_onPromptSetting($enabled)")
    }

    @JavascriptInterface
    fun setPromptEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(PREF_PROMPT_ENABLED, enabled).apply()
        js("NativeLocation_onPromptSetting($enabled)")
    }

    @JavascriptInterface
    fun searchLocations(query: String) {
        if (query.trim().length < 3) return
        Thread {
            try {
                val url = "$NOMINATIM_BASE/search?q=${java.net.URLEncoder.encode(query.trim(), "UTF-8")}&format=json&limit=5&addressdetails=0&accept-language=en"
                val request = Request.Builder().url(url).header("User-Agent", USER_AGENT).build()
                val body = http.newCall(request).execute().use { it.body?.string() ?: "[]" }
                js("NativeMap_onLocationSearchResults('${body.esc()}')")
            } catch (e: Exception) {
                js("NativeMap_onLocationSearchResults('[]')")
            }
        }.start()
    }

    @JavascriptInterface
    fun geocodeAddress(address: String) {
        Thread {
            try {
                val url = "$NOMINATIM_BASE/search?q=${java.net.URLEncoder.encode(address.trim(), "UTF-8")}&format=json&limit=1"
                val request = Request.Builder().url(url).header("User-Agent", USER_AGENT).build()
                val body = http.newCall(request).execute().use { it.body?.string() ?: "[]" }
                val arr = JSONArray(body)
                if (arr.length() > 0) {
                    val r = arr.getJSONObject(0)
                    js("NativeMap_onGeocodeResult(true, ${r.optDouble("lat")}, ${r.optDouble("lon")}, '${r.optString("display_name").esc()}')")
                } else {
                    js("NativeMap_onGeocodeResult(false, 0, 0, '')")
                }
            } catch (e: Exception) {
                js("NativeMap_onGeocodeResult(false, 0, 0, '')")
            }
        }.start()
    }

    @JavascriptInterface
    fun saveQuest(questJson: String) {
        val uid = auth.currentUser?.uid ?: "TEST_UID_12345"
        if (uid == "TEST_UID_12345") {
            js("NativeMap_onQuestSaved(true, 'TEST_QUEST_ID')")
            return
        }

        try {
            val q = JSONObject(questJson)
            db.collection("players").document(uid).get().addOnSuccessListener { playerDoc ->
                // Parse objectives array (may be absent on older quests)
                val objectivesList = mutableListOf<String>()
                val objArr = q.optJSONArray("objectives")
                if (objArr != null) {
                    for (i in 0 until objArr.length()) {
                        val s = objArr.optString(i, "")
                        if (s.isNotBlank()) objectivesList.add(s)
                    }
                }

                // Parse creatorSig object (may be absent on older quests)
                val sigMap = mutableMapOf<String, String>()
                val sig = q.optJSONObject("creatorSig")
                if (sig != null) {
                    listOf("cl", "lp", "ex", "th").forEach { key ->
                        val v = sig.optString(key, "")
                        if (v.isNotBlank()) sigMap[key] = v
                    }
                }

                val data = hashMapOf(
                    "uid" to uid,
                    "playerName" to (playerDoc.getString("name") ?: "Player"),
                    "name" to q.optString("name"),
                    "description" to q.optString("description"),
                    "location" to q.optString("location"),
                    "type" to q.optString("type"),
                    "lat" to q.optDouble("lat"),
                    "lng" to q.optDouble("lng"),
                    "rewardNum" to q.optInt("rewardNum", 0),
                    "rewardName" to q.optString("rewardName", ""),
                    "rewardXp" to q.optString("rewardXp", ""),
                    "objectives" to objectivesList,
                    "seekerType"  to q.optString("seekerType", ""),
                    "difficulty"  to q.optInt("difficulty", 1),
                    "creatorSig" to sigMap,
                    "ts" to System.currentTimeMillis()
                )
                db.collection("quests").add(data)
                    .addOnSuccessListener { ref -> js("NativeMap_onQuestSaved(true, '${ref.id}')") }
                    .addOnFailureListener { e -> 
                        Log.e(TAG, "Save failed: ${e.message}")
                        js("NativeMap_onQuestSaved(false, '')") 
                    }
            }.addOnFailureListener { js("NativeMap_onQuestSaved(false, '')") }
        } catch (e: Exception) {
            js("NativeMap_onQuestSaved(false, '')")
        }
    }

    @JavascriptInterface
    fun loadQuestMarkers() {
        db.collection("quests").get()
            .addOnSuccessListener { snap ->
                val arr = JSONArray()
                snap.documents.forEach { doc ->
                    val j = JSONObject()
                    j.put("id", doc.id)
                    j.put("uid", doc.getString("uid") ?: "")
                    j.put("playerName", doc.getString("playerName") ?: "")
                    j.put("name", doc.getString("name") ?: "")
                    j.put("description", doc.getString("description") ?: "")
                    j.put("type", doc.getString("type") ?: "exploration")
                    j.put("lat", getSafeDouble(doc, "lat"))
                    j.put("lng", getSafeDouble(doc, "lng"))
                    j.put("rewardNum", doc.getLong("rewardNum")?.toInt() ?: 0)
                    j.put("rewardName", doc.getString("rewardName") ?: "")
                    j.put("rewardXp", doc.getString("rewardXp") ?: "")
                    j.put("seekerType", doc.getString("seekerType") ?: "")
                    // objectives — stored as List<String> in Firestore
                    val objList = JSONArray()
                    @Suppress("UNCHECKED_CAST")
                    (doc.get("objectives") as? List<String>)?.forEach { objList.put(it) }
                    j.put("objectives", objList)
                    // creatorSig — stored as Map<String,String> in Firestore
                    val sigObj = JSONObject()
                    @Suppress("UNCHECKED_CAST")
                    (doc.get("creatorSig") as? Map<String, String>)?.forEach { (k, v) -> sigObj.put(k, v) }
                    j.put("creatorSig", sigObj)
                    arr.put(j)
                }
                js("NativeMap_onQuestsLoaded('${arr.toString().esc()}')")
            }
            .addOnFailureListener { js("NativeMap_onQuestsLoaded('[]')") }
    }

    @JavascriptInterface
    fun loadMyQuests() {
        val uid = auth.currentUser?.uid ?: "TEST_UID_12345"
        if (uid == "TEST_UID_12345") {
            js("NativeMap_onMyQuestsLoaded('[]')")
            return
        }

        db.collection("quests").whereEqualTo("uid", uid).get()
            .addOnSuccessListener { snap ->
                val arr = JSONArray()
                snap.documents.forEach { doc ->
                    val j = JSONObject()
                    j.put("id", doc.id)
                    j.put("name", doc.getString("name") ?: "")
                    j.put("description", doc.getString("description") ?: "")
                    j.put("location", doc.getString("location") ?: "")
                    j.put("type", doc.getString("type") ?: "exploration")
                    j.put("rewardNum", doc.getLong("rewardNum")?.toInt() ?: 0)
                    j.put("rewardName", doc.getString("rewardName") ?: "")
                    j.put("rewardXp", doc.getString("rewardXp") ?: "")
                    j.put("seekerType", doc.getString("seekerType") ?: "")
                    val objList = JSONArray()
                    @Suppress("UNCHECKED_CAST")
                    (doc.get("objectives") as? List<String>)?.forEach { objList.put(it) }
                    j.put("objectives", objList)
                    val sigObj = JSONObject()
                    @Suppress("UNCHECKED_CAST")
                    (doc.get("creatorSig") as? Map<String, String>)?.forEach { (k, v) -> sigObj.put(k, v) }
                    j.put("creatorSig", sigObj)
                    arr.put(j)
                }
                js("NativeMap_onMyQuestsLoaded('${arr.toString().esc()}')")
            }
            .addOnFailureListener { js("NativeMap_onMyQuestsLoaded('[]')") }
    }

    @JavascriptInterface
    fun deleteQuest(questId: String) {
        if (questId == "TEST_QUEST_ID") {
            js("NativeMap_onQuestDeleted(true, 'TEST_QUEST_ID')")
            return
        }
        db.collection("quests").document(questId).delete()
            .addOnSuccessListener { js("NativeMap_onQuestDeleted(true, '$questId')") }
            .addOnFailureListener { e -> 
                Log.e(TAG, "Delete failed: ${e.message}")
                js("NativeMap_onQuestDeleted(false, '$questId')") 
            }
    }

    @JavascriptInterface
    fun savePlayerXP(charXP: Int, charLevel: Int, freqXP: Int, freqLevel: Int, statXPJson: String) {
        val uid = auth.currentUser?.uid ?: ""
        if (uid.isEmpty()) return
        db.collection("players").document(uid)
            .update(mapOf(
                "charXP"     to charXP,
                "charLevel"  to charLevel,
                "freqXP"     to freqXP,
                "freqLevel"  to freqLevel,
                "statXP"     to statXPJson
            ))
            .addOnFailureListener { e -> Log.e(TAG, "savePlayerXP failed: ${e.message}") }
    }

    private fun getSafeDouble(doc: com.google.firebase.firestore.DocumentSnapshot, field: String): Double {
        return try {
            doc.getDouble(field) ?: doc.getLong(field)?.toDouble() ?: 0.0
        } catch (e: Exception) { 0.0 }
    }

    private fun js(script: String) = webView.post { webView.evaluateJavascript(script, null) }
    private fun String.esc() = this.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
}
