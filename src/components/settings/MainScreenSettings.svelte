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
      console.log(666);
      console.log(detail);
      changeSetting('showActivityNearTimer', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_main_tabs')}"
    checked="{$settings.showMainTabs}"
    on:change="{({ detail }) => {
      console.log(111);
      console.log(detail);
      changeSetting('showMainTabs', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_comment')}"
    checked="{$settings.showComment}"
    on:change="{({ detail }) => {
      console.log(222);
      console.log(detail);
      changeSetting('showComment', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_current_activity_main_screen')}"
    checked="{$settings.showCurrentActivityOnMainScreen}"
    on:change="{({ detail }) => {
      console.log(333);
      console.log(detail);
      changeSetting('showCurrentActivityOnMainScreen', detail);
    }}"
  />
  {#if $settings.showCurrentActivityOnMainScreen}
    <CustomCheckbox
      label="{$_('settings.show_current_activity_label_main_screen')}"
      checked="{$settings.showCurrentActivityLabelOnMainScreen}"
      on:change="{({ detail }) => {
        console.log(444);
      console.log(detail);
        changeSetting('showCurrentActivityLabelOnMainScreen', detail);
      }}"
    />
  {/if}
  <CustomCheckbox
    label="{$_('settings.show_current_period_above_timer')}"
    checked="{$settings.showCurrentPeriodAboveTimer}"
    on:change="{({ detail }) => {
      console.log(555);
      console.log(detail);
      changeSetting('showCurrentPeriodAboveTimer', detail);
    }}"
  />
</div>
