<script>
  import { _ } from 'svelte-i18n';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomCheckbox from './../form-elements/CustomCheckbox.svelte';
</script>

<div class="main-screen-settings">
  <CustomCheckbox
    label="{$_('settings.show_activity_near_timer')}"
    checked="{$settings.showActivityNearTimer}"
    on:change="{({ detail }) => {
      changeSetting('showActivityNearTimer', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_main_tabs')}"
    checked="{$settings.showMainTabs}"
    on:change="{({ detail }) => {
      changeSetting('showMainTabs', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_comment')}"
    checked="{$settings.showComment}"
    on:change="{({ detail }) => {
      changeSetting('showComment', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_current_activity_main_screen')}"
    checked="{$settings.showCurrentActivityOnMainScreen}"
    on:change="{({ detail }) => {
      changeSetting('showCurrentActivityOnMainScreen', detail);
    }}"
  />
  {#if $settings.showCurrentActivityOnMainScreen}
    <CustomCheckbox
      indented
      label="{$_('settings.show_current_activity_label_main_screen')}"
      checked="{$settings.showCurrentActivityLabelOnMainScreen}"
      on:change="{({ detail }) => {
        changeSetting('showCurrentActivityLabelOnMainScreen', detail);
      }}"
    />
  {/if}
  <CustomCheckbox
    label="{$_('settings.period_description')}"
    checked="{$settings.showDescriptionsForPeriods}"
    on:change="{({ detail }) => {
      changeSetting('showDescriptionsForPeriods', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_current_period_above_timer')}"
    checked="{$settings.showCurrentPeriodAboveTimer}"
    on:change="{({ detail }) => {
      changeSetting('showCurrentPeriodAboveTimer', detail);
    }}"
  />
</div>
