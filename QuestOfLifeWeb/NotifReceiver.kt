package com.sourcecodelife.app

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat

/**
 * Fires when the daily alarm goes off.
 * Posts the notification and reschedules itself for exactly 24 hours later.
 */
class NotifReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG          = "NotifReceiver"
        private const val CHANNEL_ID   = "scl_daily_energy"
        private const val CHANNEL_NAME = "Daily Energy Briefing"
        private const val NOTIF_ID     = 2001
        private const val REQUEST_CODE = 1001

        fun postNotification(context: Context, title: String, body: String, openTab: String = "quests") {
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Create channel once (no-op if already exists)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "Your personal day energy and daily mission objective."
                    enableLights(true)
                    enableVibration(false)
                }
                nm.createNotificationChannel(channel)
            }

            // Tapping the notification opens the app to the specified tab
            val openAppIntent = context.packageManager
                .getLaunchIntentForPackage(context.packageName)
                ?.apply { 
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    putExtra("open_tab", openTab) 
                }

            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            else
                PendingIntent.FLAG_UPDATE_CURRENT

            // Use unique request code per tab so PendingIntents don't collide
            val requestCode = if (openTab == "map") 3001 else 3000

            val tapIntent = PendingIntent.getActivity(
                context, requestCode, openAppIntent ?: Intent(), flags
            )

            val notification = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(NotificationCompat.BigTextStyle().bigText(body))
                .setContentIntent(tapIntent)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .build()

            nm.notify(NOTIF_ID, notification)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            Log.d(TAG, "Boot completed - usually we would restore alarms here if needed")
            return
        }

        val title = intent.getStringExtra("notif_title") ?: "✦ Daily Energy"
        val body  = intent.getStringExtra("notif_body")  ?: ""

        postNotification(context, title, body)

        // Reschedule for exactly 24 hours from now
        rescheduleIn24Hours(context, title, body)
    }

    private fun rescheduleIn24Hours(context: Context, title: String, body: String) {
        val alarmMgr = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val nextIntent = Intent(context, NotifReceiver::class.java).apply {
            putExtra("notif_title", title)
            putExtra("notif_body",  body)
        }
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        else
            PendingIntent.FLAG_UPDATE_CURRENT

        val pendingIntent = PendingIntent.getBroadcast(
            context, REQUEST_CODE, nextIntent, flags
        )

        val nextTrigger = System.currentTimeMillis() + AlarmManager.INTERVAL_DAY

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (alarmMgr.canScheduleExactAlarms()) {
                alarmMgr.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, nextTrigger, pendingIntent)
            } else {
                alarmMgr.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, nextTrigger, pendingIntent)
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmMgr.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, nextTrigger, pendingIntent)
        } else {
            alarmMgr.set(AlarmManager.RTC_WAKEUP, nextTrigger, pendingIntent)
        }
    }
}
