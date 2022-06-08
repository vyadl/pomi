<script>
  import { _ } from 'svelte-i18n';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomCheckbox from './../form-elements/CustomCheckbox.svelte';
  import SettingDescription from './../decorative/SettingDescription.svelte';

  let showNotificationWarning = false;

  function changeNotificationSetting(value) {
    if (value && Notification.permission === 'default') {
      const permission = Notification.requestPermission();

      permission.then(answer => {
        if (answer === 'granted') {
          changeSetting('showNotifications', 1);
          showTestNotification();
        } else {
          changeSetting('showNotifications', 0);
        }
      })
    } else {
      changeSetting('showNotifications', value);
    }

    if (value && Notification.permission === 'granted') {
      showTestNotification();
    }
  }

  function showTestNotification() {
    new Notification($_('notifications.test'), { body: $_('notifications.test_body') });
    showNotificationWarning = true;
  }
</script>

<div class="behaviour-settings">
  <CustomCheckbox
    label="{$_('settings.subtract_time')}"
    checked="{$settings.subtractTimeWhenFinishing}"
    on:change="{({ detail }) => {
      changeSetting('subtractTimeWhenFinishing', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_notifications')}"
    disabled="{Notification.permission === 'denied'}"
    checked="{$settings.showNotifications}"
    on:change="{({ detail }) => {
      changeNotificationSetting(detail);
    }}"
  />
  {#if $settings && Notification.permission === 'denied'}
    <SettingDescription>
      {$_('settings.change_notifications_permission')}
    </SettingDescription>
  {/if}
  {#if showNotificationWarning}
    <SettingDescription>
      {$_('notifications.warning')}
    </SettingDescription>
  {/if}
</div>
