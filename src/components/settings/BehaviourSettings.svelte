<script>
  import { _ } from 'svelte-i18n';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomCheckbox from './../form-elements/CustomCheckbox.svelte';
  import CustomInput from './../form-elements/CustomInput.svelte';
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
  <CustomCheckbox
    label="{$_('settings.remind_after_finish_activity')}"
    checked="{$settings.remindAfterFinishActivity}"
    on:change="{({ detail }) => {
      changeSetting('remindAfterFinishActivity', detail);
    }}"
  />
  {#if $settings.remindAfterFinishActivity}
    <CustomInput
      type="range"
      label="{`${$_('settings.remind_every')} ${$settings.minutesForReminding} ${$_('minutes_short')}`}"
      value="{$settings.minutesForReminding}"
      optionalProps="{
        {
          min: '1',
          max: '30',
          step: '1',
        }
      }"
      on:input="{({ detail }) => {
        changeSetting('minutesForReminding', detail, false);
      }}"
    />
  {/if}
  <CustomCheckbox
    label="{$_('settings.run_next_interval')}"
    checked="{$settings.runNextTypeIntervalAfterFinishing}"
    on:change="{({ detail }) => {
      changeSetting('runNextTypeIntervalAfterFinishing', detail);
    }}"
  />
</div>
