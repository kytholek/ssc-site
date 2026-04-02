package com.sourcecodelife.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import android.webkit.JavascriptInterface
import java.util.Calendar

/**
 * JavaScript bridge for daily energy notifications.
 */
class NotifBridge(private val context: Context) {

    private val TAG = "NotifBridge"

    companion object {
        const val REQUEST_CODE   = 1001
        const val EXTRA_TITLE    = "notif_title"
        const val EXTRA_BODY     = "notif_body"
        const val ACTION_DAILY   = "com.sourcecodelife.app.DAILY_NOTIF"
    }

    @JavascriptInterface
    fun scheduleDaily(hour: Int, minute: Int, title: String, body: String) {
        val appContext = context.applicationContext
        val alarmMgr = appContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        Log.d(TAG, "Scheduling daily notif for $hour:$minute - Title: $title")

        val intent = Intent(appContext, NotifReceiver::class.java).apply {
            action = ACTION_DAILY
            putExtra(EXTRA_TITLE, title)
            putExtra(EXTRA_BODY,  body)
        }
        
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE

        val pendingIntent = PendingIntent.getBroadcast(
            appContext, REQUEST_CODE, intent, flags
        )

        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE,      minute)
            set(Calendar.SECOND,      0)
            set(Calendar.MILLISECOND, 0)
            // If the time has already passed today, schedule for tomorrow
            if (timeInMillis <= System.currentTimeMillis()) {
                add(Calendar.DAY_OF_YEAR, 1)
            }
        }

        Log.d(TAG, "Next alarm set for: ${cal.time}")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (alarmMgr.canScheduleExactAlarms()) {
                alarmMgr.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pendingIntent)
            } else {
                alarmMgr.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pendingIntent)
            }
        } else {
            alarmMgr.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pendingIntent)
        }
    }

    @JavascriptInterface
    fun cancelDaily() {
        val appContext = context.applicationContext
        val alarmMgr = appContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE

        val intent = Intent(appContext, NotifReceiver::class.java).apply {
            action = ACTION_DAILY
        }
        val pendingIntent = PendingIntent.getBroadcast(
            appContext, REQUEST_CODE, intent, flags
        )
        alarmMgr.cancel(pendingIntent)
        Log.d(TAG, "Daily notification canceled")
    }

    @JavascriptInterface
    fun sendNow(title: String, body: String) {
        Log.d(TAG, "Sending test notification immediately")
        NotifReceiver.postNotification(context, title, body)
    }
}
